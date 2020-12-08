# Change Log

All notable changes to the __gqlformatter__ extension will be documented in this file.

## [Unreleased]

## [0.0.1] - 2020-12-02
### Added
- language support for
  - TS
  - TSX

## [0.0.2] - 2020-12-03
### Changed the version
- need to know how to update the extension

## [0.0.3] - 2020-12-07
### Changed
|CHANGE|formatGqlString|
|-|-|
|BEFORE|Each corrected string was a single edit.  This means that if the formatGqlString command corrected 3 strings, it would require 3 undos to get back to the initial state.|
|AFTER|All GQL strings are updated as a single edit.  This means a single undo gets you back to the initial state.|

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
