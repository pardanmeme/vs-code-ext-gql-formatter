import * as vscode from 'vscode';
import { Position, Range, WorkspaceEdit } from 'vscode';
const endOfLine = require('os').EOL;

import { indentConfigValue, supportGQLConfigValue, supportTrailingCommentConfigValue } from './configuration';


type UserConfig = {
    tabSize: number,
    isGQL: boolean,
    isTrailingComments: boolean,
};

function getUserConfig(): UserConfig {
    return {
        tabSize: indentConfigValue(),
        isGQL: supportGQLConfigValue(),
        isTrailingComments: supportTrailingCommentConfigValue(),
    };
}

export function activate(context: vscode.ExtensionContext) {

    const command_echoSettings = 'normanstypczynski.gqlformatter.echo.settings';

    let sqlFormatterEchoSettings = vscode.commands.registerCommand(
        command_echoSettings,
        () => {
            vscode.window.showInformationMessage(JSON.stringify(
                getUserConfig(),
                undefined,
                1
            ));
        }
    );
    context.subscriptions.push(sqlFormatterEchoSettings);


    const command_frmtGqlString: string = 'normanstypczynski.gqlformatter.formatGqlString';

    function frmt(
        gql: string[],
        indent: number,
        isTrailingCommentOK: boolean,
        initialIndent: number = 0,
        eol: string = endOfLine
    ): string {
        const trimmed = gql.map((line) => line.trimLeft());
        let dent = initialIndent;
        const formattedLines = trimmed.map((line) => {
            if (line.startsWith('}')) {
                dent -= indent;
            }
            const formatted = ''.padStart(dent, ' ') + line;
            if (formatted.endsWith('{') || (isTrailingCommentOK && formatted.includes('{ #'))) {
                dent += indent;
            }
            return formatted;
        });

        let needsFormatted = false;
        for (let i = 0; i < gql.length; i++) {
            if (gql[i].trim().length) {
                needsFormatted = needsFormatted || gql[i] !== formattedLines[i];
            }
        }

        if (needsFormatted) {
            return formattedLines.join(eol).replace(/^[ ]*|[ ]*$/g, "");
        } else {
            return '';
        }
    }

    function formatGQLstrings(
        userConfig: UserConfig,
        document: vscode.TextDocument,
        index: number,
        edits: number,
        edit: WorkspaceEdit,
        gql?: { start: Position, lines: string[] },
    ): void {
        if (index >= document.lineCount) {
            if (edit.has(document.uri)) {
                vscode.workspace.applyEdit(edit).then(result => {
                    const failedMsg = result ? "" : " with failure.";
                    vscode.window.showInformationMessage("GQL Formats = " + edits + failedMsg);
                });
            } else {
                vscode.window.showInformationMessage("GQL Formats = None");
            }
            return;
        }

        const line = document.lineAt(index);

        if (!gql) {
            const open = 'gql`';
            const validStarts = ['const', 'export const'];
            if (!validStarts.some(validStart => line.text.startsWith(validStart)) ||
                !line.text.includes(open)) {
                return formatGQLstrings(userConfig, document, index + 1, edits, edit, gql);
            } else {
                const startPosition = new Position(line.range.start.line, line.text.indexOf(open) + open.length);
                return formatGQLstrings(userConfig, document, index + 1, edits, edit, {
                    start: startPosition,
                    lines: [line.text.substr(startPosition.character)]
                });
            }
        } else {
            const close = '`';
            const comment = '#';
            if (line.text.startsWith(comment) || !line.text.includes(close)) {
                gql.lines.push(line.text);
                return formatGQLstrings(userConfig, document, index + 1, edits, edit, gql);
            } else {
                const quoteIndex = line.text.indexOf(close);
                const beforeQuote = line.text.substring(0, quoteIndex);
                gql.lines.push(beforeQuote);
                if (beforeQuote.trim().length) {
                    gql.lines.push('');
                }
                const frmted = frmt(
                    gql.lines,
                    userConfig.tabSize,
                    userConfig.isTrailingComments,
                    userConfig.tabSize
                );
                if (frmted.length) {
                    const endPosition = new Position(line.range.start.line, line.text.indexOf(close));
                    edit.replace(document.uri, new Range(gql.start, endPosition), frmted);
                    return formatGQLstrings(userConfig, document, index + 1, edits + 1, edit);
                } else {
                    return formatGQLstrings(userConfig, document, index + 1, edits, edit);
                }
            }
        }
    }

    function formatGQLfile(
        userConfig: UserConfig,
        document: vscode.TextDocument,
    ): void {
        if (document.lineCount) {
            const frmted = frmt(
                document.getText().split(endOfLine),
                userConfig.tabSize,
                userConfig.isTrailingComments,
            );
            if (frmted.length) {
                const lastline = document.lineAt(document.lineCount - 1);
                const edit = new WorkspaceEdit();
                edit.replace(document.uri, new Range(
                    new Position(0, 0), lastline.range.end),
                    frmted,
                );
                vscode.workspace.applyEdit(edit).then(result => {
                    const failedMsg = result ? "" : " with failure.";
                    vscode.window.showInformationMessage("Formatted GQL file " + failedMsg);
                });
            } else {
                vscode.window.showInformationMessage("GQL File is already formatted");
            }
        }
    }

    vscode.commands.registerCommand(command_frmtGqlString, () => {
        const { activeTextEditor } = vscode.window;

        if (activeTextEditor) {
            const { document } = activeTextEditor;
            switch (activeTextEditor.document.languageId) {
                case 'typescript':
                case 'typescriptreact':
                    return formatGQLstrings(getUserConfig(), document, 0, 0, new WorkspaceEdit());
                case 'graphql':
                    const userConfig = getUserConfig();
                    if (userConfig.isGQL) {
                        return formatGQLfile(getUserConfig(), document);
                    }
            }
        }
    });

}

export function deactivate() { }
