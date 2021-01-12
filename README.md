# gql formatter command

This extension adds a command to VS Code that will fix the indentions inside a gql string.
You can use it from an open editor tab.  File types supported are ts and tsx.

## Possible Use Case
Are you're using https://graphql-code-generator.com/?

Try this on the page

schema.graphql
```
type Query {
  things: [String!]!
}
```

operations.gql
```
query Things {
    things
}
```

codegen.yml
```
generates:
  types.ts:
    plugins:
      - typescript
      - typescript-react-apollo
```

In types.ts, you'll see some generated gql
```javascript
export const ThingsDocument = gql`
    query Things {
  things
}
    `;
```

1. paste that gql into a ts or tsx file in Visual Studio Code
1. with this extension installed, run **ns gqlformatter format gql**

Then the indentions of the gql are improved.
```javascript
export const ThingsDocument = gql`
      query Things {
            things
      }
`;
```


## Features

**ns gqlformatter format gql** will correct the indentions of a gql string in the open file when:
* the line starts with one of:
  * const
  * export const
* the line contains _gql`_

## Extension Settings

This extension contributes the following settings:

_Tab Size_
* `normanstypczynski.gqlformatter.formatGqlString.tabSize`
* default: 6


## Known Issues

None

## Additional

| CMD   | DESC |
|-------|------|
|ns gqlformatter echo settings|produces an info notification with a static message containing the settings.|