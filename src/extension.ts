import * as vscode from 'vscode';
import { Position, Range, WorkspaceEdit } from 'vscode';
const endOfLine = require('os').EOL;

import { indentConfigValue } from './configuration';


type UserConfig = {
  indent: number
}

export function activate(context: vscode.ExtensionContext) {

  let helloWorld = vscode.commands.registerCommand(
    'normanstypczynski.helloWorld',
    () => { vscode.window.showInformationMessage("Ken's first extension just helped you!") }
  );
  context.subscriptions.push(helloWorld);


  context.subscriptions.push(vscode.commands.registerCommand(
    'normanstypczynski.informCurrentTime',
    () => {
      // console shows up in the DEBUG CONSOLE
      console.log(`${new Date()}`);
      console.error('errors can be logged here.');
      vscode.window.showWarningMessage(`${new Date()}`);
    }
  ));


  const frmtCommand: string = 'normanstypczynski.formatter.gql.string';

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
      console.log(i, '[' + gql[i] + ']');
      console.log(i, '[' + formattedLines[i] + ']');
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
    accumulated: WorkspaceEdit[],
    gql?: { start: Position, lines: string[] },
  ): void {
    if (index >= document.lineCount) {
      // const results = accumulated.map(async a => {
        // return await vscode.workspace.applyEdit(a)
      // });
      // Promise.all(results).then(arrayOfResults => {
        // const failedCount = arrayOfResults.filter(b => !b).length;
        // const failedMsg = failedCount ? ` failed = ${failedCount}` : '';
        // vscode.window.showInformationMessage("GQL Formats = " + accumulated.length + failedMsg);
      // });

      const init: boolean[] = [];
      accumulated.reduce((a, i) => {
        return a.then(chainResults =>
          vscode.workspace.applyEdit(i).then(currentResult =>
            [...chainResults, currentResult]
          )
        )
      }, Promise.resolve(init)).then(arrayOfResults => {
        const failedCount = arrayOfResults.filter(b => !b).length;
        const failedMsg = failedCount ? ` failed = ${failedCount}` : '';
        vscode.window.showInformationMessage("GQL Formats = " + accumulated.length + failedMsg);
      });
      return;
    }

    const line = document.lineAt(index);

    if (!gql) {
      const open = 'gql`';
      if ((!line.text.startsWith('const') && !line.text.startsWith('export const')) || !line.text.includes(open)) {
        return formatGQLstrings(userConfig, document, index + 1, accumulated, gql);
      } else {
        const startPosition = new Position(line.range.start.line, line.text.indexOf(open) + open.length);
        return formatGQLstrings(userConfig, document, index + 1, accumulated, {
          start: startPosition,
          lines: [line.text.substr(startPosition.character)]
        });
      }
    } else {
      const close = '`';
      if (line.text.startsWith('#') || !line.text.includes(close)) {
        gql.lines.push(line.text);
        return formatGQLstrings(userConfig, document, index + 1, accumulated, gql);
      } else {
        gql.lines.push('');
        const frmted = frmt(gql.lines, userConfig.indent);
        if (frmted.length) {
          const endPosition = new Position(line.range.start.line, line.text.indexOf(close));
          const edit = new WorkspaceEdit();
          edit.replace(document.uri, new Range(gql.start, endPosition), frmted);
          accumulated.push(edit);
        }
        return formatGQLstrings(userConfig, document, index + 1, accumulated);
      }
    }
  }

  vscode.commands.registerCommand(frmtCommand, () => {
    const { activeTextEditor } = vscode.window;

    if (activeTextEditor && (activeTextEditor.document.languageId === 'typescriptreact' || activeTextEditor.document.languageId === 'typescript')) {
      const indent = indentConfigValue(6);

      const { document } = activeTextEditor;
      return formatGQLstrings({ indent }, document, 0, []);
    }
  })

  // vs code says this is better, but I can't use it to EXTEND the current formatter?
  // vscode.languages.registerDocumentFormattingEditProvider('typescript', {
  //   provideDocumentFormattingEdits(document: vscode.TextDocument): vscode.TextEdit[] {
  //     const comment = "// Partially formatted using Kens gql formatting extension";
  //     const firstLine = document.lineAt(0);
  //     if (firstLine.text !== comment) {
  //       return [vscode.TextEdit.insert(firstLine.range.start, comment)];
  //     } else {
  //       return [];
  //     }
  //   }
  // })
}

export function deactivate() { }
