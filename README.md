# gql formatter command

This extension adds a command to VS Code that will fix the indentions inside a gql string.
You can use it from an open editor tab.  File types supported are ts, tsx, gql and graphql.

## Possible Use Case
Are you using https://graphql-code-generator.com/?

Try this on that webpage

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

**ns gqlformatter format gql** will correct the indentions of all gql strings in the open file when:
* the file is of type ts or tsx
* the line starts with one of:
  * const
  * export const
* the line contains _gql`_

**ns gqlformatter format gql** will correct the indentions of the whole file when:
* the file is of type gql or graphql
* normanstypczynski.gqlformatter.enable.graphql is true

## Extension Settings

This extension contributes the following settings:

_Tab Size_
* `normanstypczynski.gqlformatter.formatGqlString.tabSize`
* default: 6

_Enable GraphQL_
* `normanstypczynski.gqlformatter.enable.graphql`
* default: false

_Allow Trailing Comment_  
I've found I occasionally like to add comments after an open curly to denote the type of the object like:
```javascript
query ListThings($input: ListThingsInput!) {
    listThings(input: $input) { # ThingsConnection
        totalCount
        edges { # Thing
            id
        }
    }
};
```
This caused the formatting to not work properly because it's looking for the line to end with an open curly.  
Allow trailing comments causes it too look for the line to contain open curly, space, pound sign.
* `normanstypczynski.gqlformatter.allow.trailing.comment`
* default: false

## Known Issues

None

## Additional

| CMD   | DESC |
|-------|------|
|ns gqlformatter echo settings|produces an info notification with a static message containing the settings.|
