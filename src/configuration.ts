import { workspace } from 'vscode';

export function indentConfigValue(orElse: number): number {
  let v;

  v = getInt(workspace.getConfiguration('kinc.command.format.gql').get('indent'));
  if (v) { return v; }

  v = getInt(workspace.getConfiguration('editor').get('tabSize'));
  if (v) { return v; }

  return 6;
}


function getInt(v: string | undefined): number | undefined {
  if (v) {
    const n = parseInt(v, 10);
    return Number.isInteger(n) ? n : undefined;
  }
  return undefined;
}