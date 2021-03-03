import { workspace, WorkspaceConfiguration } from 'vscode';

export function indentConfigValue(): number {
    return getInt(
        myConfig().get('formatGqlString.tabSize'),
        6,
    );
}

export function supportGQLConfigValue(): boolean {
    return getBool(
        myConfig().get('enable.graphql'),
        false,
    );
}

export function supportTrailingCommentConfigValue(): boolean {
    return getBool(
        myConfig().get('allow.trailing.comment'),
        false,
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

function getBool(v: boolean | undefined, orElse: boolean): boolean {
    if (v !== undefined) {
        return v;
    }
    return orElse;
}