# Change Log

All notable changes to the __gqlformatter__ extension will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/) and this project adheres to [Semantic Versioning](http://semver.org/).


## [1.1.1] - 2021-03-03

### Added
- language support for gql and graphql
  - to enable it set *normanstypczynski.gqlformatter.enable.graphql* to true
- trailing comment after open curly is ok.  E.G. createThing(input: $input) { # Thing
  - to enable it set *normanstypczynski.gqlformatter.allow.trailing.comment* to true


## [1.0.1] - 2021-01-11

### Fixed

The last line of a change was not always being preserved correctly.  
E.G.
```javascript
export const SomeMutationDocument = gql`
  mutation SomeMutation($input: SomeInput!) {
    doSomeMutation(input: $input) {
      ...MyFragment
    }
  }
${MyFragmentFragmentDoc}`;
```
The fragment reference would be lost
```javascript
export const SomeMutationDocument = gql`
    mutation SomeMutation($input: SomeInput!) {
        doSomeMutation(input: $input) {
            ...MyFragment
        }
    }
`;
```
It is now correct
```javascript
export const SomeMutationDocument = gql`
    mutation SomeMutation($input: SomeInput!) {
        doSomeMutation(input: $input) {
            ...MyFragment
        }
    }
    ${MyFragmentFragmentDoc}
`;
```


## [1.0.0] - 2020-12-08

### Removed
- command - ns hello
- command - ns now

### Changed
- format gql command
  - name to __normanstypczynski.gqlformatter.formatGqlString__
  - title to __ns gqlformatter format gql__
  - keyboard shortcut to __shift+alt+cmd+n q__

### Added
- command - ns gqlformatter echo settings
- MIT license


## [0.0.3] - 2020-12-07

### Changed
|CHANGE|formatGqlString|
|-|-|
|BEFORE|Each corrected string was a single edit.  This means that if the formatGqlString command corrected 3 strings, it would require 3 undos to get back to the initial state.|
|AFTER|All GQL strings are updated as a single edit.  This means a single undo gets you back to the initial state.|


## [0.0.2] - 2020-12-03

### Changed the version
- need to know how to update the extension


## [0.0.1] - 2020-12-02

### Added
- language support for
  - TS
  - TSX
