# gql formatter command

This extension adds a command to VS Code that will fix the indentions inside a gql string.
You can use it from an open editor tab.  File types supported are ts and tsx.

## Features

It will correct the indentions of a gql string in the open file when:
* the line starts with one of:
  * const
  * export const
* the line contains _gql`_

## Extension Settings

This extension contributes the following settings:

_Tab Size_
* `normanstypczynski.gqlformatter.formatGqlString.tabSize`
* default: 6

## Example
assuming `normanstypczynski.gqlformatter.formatGqlString.tabSize: 4`:
```javascript
export const LIST_THINGS = gql`
query ListThing {
listThing {
                              id
name
}
}
`;
```
would become
```javascript
export const LIST_THINGS = gql`
    query ListThing {
        listThing {
            id
            name
        }
    }
`;
```

## Known Issues

## Additional

| CMD   | DESC |
|-------|------|
|ns gqlformatter echo settings|produces an info notification with a static message containing the settings.|