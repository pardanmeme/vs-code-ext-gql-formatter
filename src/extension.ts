import * as vscode from 'vscode';
import { Position, Range, WorkspaceEdit } from 'vscode';
const endOfLine = require('os').EOL;

import { indentConfigValue } from './configuration';


type UserConfig = {
    tabSize: number
};

function getUserConfig(): UserConfig {
    return { tabSize: indentConfigValue() };
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

    function frmt(gql: string[], indent: number, eol: string = endOfLine): string {
        const trimmed = gql.map((line) => line.trimLeft());
        let dent = indent;
        const formattedLines = trimmed.map((line) => {
            if (line.startsWith('}')) {
                dent -= indent;
            }
            const formatted = ''.padStart(dent, ' ') + line;
            if (formatted.endsWith('{')) {
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
                gql.lines.push('');
                const frmted = frmt(gql.lines, userConfig.tabSize);
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

    vscode.commands.registerCommand(command_frmtGqlString, () => {
        const { activeTextEditor } = vscode.window;
        const supportedLanguages = ['typescript', 'typescriptreact'];

        if (activeTextEditor && supportedLanguages.includes(activeTextEditor.document.languageId)) {
            const { document } = activeTextEditor;
            const userConfig = getUserConfig();
            return formatGQLstrings(userConfig, document, 0, 0, new WorkspaceEdit());
        }
    });

}

export function deactivate() { }
