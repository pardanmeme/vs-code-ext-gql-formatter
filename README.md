# gql formatter command README

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
* `kinc.command.format.gql.indent`
* `editor.tabSize`
* 6

## Known Issues

There is no update functionality.  To update, uninstall and reinstall using the new vsix.

## Additional

2 commands are included that were in the tutorial.
They have not yet been removed.

| CMD   | DESC |
|-------|------|
|k hello|produces an info notification with a static message.|
|k now  |produces an warning notification with the current time.|