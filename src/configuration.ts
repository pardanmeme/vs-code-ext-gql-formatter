import { workspace, WorkspaceConfiguration } from 'vscode';

export function indentConfigValue(): number {
    return getInt(
        myConfig().get('formatGqlString.tabSize'),
        6
    );
}


function myConfig(): WorkspaceConfiguration {
    return workspace.getConfiguration('normanstypczynski.gqlformatter');
}

function getInt(v: string | undefined, orElse: number): number {
    if (v) {
        const n = parseInt(v, 10);
        return Number.isInteger(n) ? n : orElse;
    }
    return orElse;
}