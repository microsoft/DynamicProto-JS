# Releases

## 2.0.3 (Jan 11th, 2024)

Blocks a medium level prototype pollution vulnerability.

### Changes

- #81 [Main] Task 26377610: [DynamicProto] Investigate possible security issue with prototype pollution
  - This removes the identified methods for polluting the prototype chain by
    - adding additional checks to the _isDynamicCandidate() and _populateProtype() functions.
    - Using Object.create(null) for internal objects to avoid prototype pollution.

## 2.0.2 (Mar 31st, 2023)

### Changes

- #78 [Packaging] 2.0.1 does not include the removeDynamic.ts script

## 2.0.1 (Mar 30th, 2023)

### Changes

- #73 [Main] Fix npm pack and publish issues

## 2.0.0 (Mar 27th, 2023)

### Breaking Changes from Version 1.x ###

- Removed ES3 / IE8 support
- ES5 `Object.defineProperty()` is required during runtime.

### Changes

- Version 2.x development moved to [main branch](https://github.com/microsoft/DynamicProto-JS/tree/main) which is now the default branch, Version 1.x is still maintained from the [master branch](https://github.com/microsoft/DynamicProto-JS/tree/master)
- Removed private internal getGlobal() and hasOwnProperty() functions to provide better minification when bundled with other packages that also implement these functions by using [@nevware21/ts-utils](https://github.com/nevware21/ts-utils) as the dependency.
 
## 1.1.8 (Feb 27th, 2023)

- #61 Exclude files from published package
- #65 Bump external library Sinon.JS to newer version which does not use eval
- #64 Internal Task 17133116: Add Policheck exclusion file
- #62 Add --no-sandbox to test runs

## 1.1.7 (Oct 11th, 2022)

- #55 Update and add legal compliance notices and license terms
- #56 Semmle warning help
- #57 [Bug] Corner case issue when extending the same "Class" name from different components

## 1.1.6 (May 4th, 2022)

- #50 [IE8] Fix in 1.1.5 only handles 2 levels of dynamically nested classes

## 1.1.5 (Apr 28th, 2022)

- #47 [IE8] The _checkPrototype always fails on IE in IE8 mode

## 1.1.4 (Jun 3rd, 2021)

- #36 v1.1.3 postinstall requires rush to be installed

## 1.1.3 (Jun 3rd, 2021)

There are no functional (code) differences between v1.1.2 and v1.1.3, both issues below are related to the build and packaging pipelines only.

- #33 Version 1.1.2 has extraneous dependencies such as findup-sync (Build Only)
- #34 Task 9901543: Remediate security vulnerabilities (Build only)

## 1.1.2 (Apr 16th, 2021)

- #31 [BUG] _checkPrototype function loops indefinitely when calling Invoke-WebRequest cmdlet against a docs.microsoft.com webpage

## 1.1.1 (Mar 10th, 2021)

### Changelog

- #28 [ES6] TypeError: xxx is not a function or TypeError: DynamicProto [XXXX] is not in class heirarchy of [Object]
- Added this RELEASES.md file

## 1.1.0 (Oct 14th, 2020)

### Changelog

- #24 [Feature Request] Performance optimization - ability to keep/set instance level function to avoid dynamic proxy lookup

## 1.0.1 (Sep 24th, 2020)

### Changelog

- #22 Add sideEffects field to package.json

## 1.0.0 and 0.5.3 (Jul 7th, 2020)

### Changelog

- Update version to major release based on stability
- #20 WARN @microsoft/dynamicproto-js@0.5.2 requires a peer of tslib@^1.9.3 but none was installed.
  - Remove unused peerDependency for tslib

## 0.5.2 (Mar 24th, 2020)

### Changelog

- Fix issue causing long running script error on IE7/8
- #19 getBaseFuncs() usage of _getObjProto() is causing a long running script (it's broken) when running Internet explorer in 7/8 mode.
- #16 The dynamicRemove() rollup is not removing methods with default arguments or is using the spread operator

## 0.5.1 (Jan 14th, 2020)

### Changelog

- #14 postinstall script is causing consumption of the npm package to fail -- remove
- Enable the tagging and removal of stub methods during packaging #11
  - Added rollup plugin to enable the removal of stub functions, required to enable declaration (*.d.ts) files to match the runtime resulting class definition.
  - By using the rollup plugin this will remove the tagged stub functions during packaging with rollup.

## 0.5.0 (Jan 14th, 2020) - Pre-release

### Changelog

- #11 Enable the tagging and removal of stub methods during packaging
  - Added rollup plugin to enable the removal of stub functions, required to enable declaration (*.d.ts) files to match the runtime resulting class definition.
  - By using the rollup plugin this will remove the tagged stub functions during packaging with rollup.

## 0.2.0 (Nov 18th, 2019)

### Changelog

- Corrected the publishing and minification of the dist/esm module

## 0.1.0 (Nov 18th, 2019)

### Changelog

- Update NPM packaging and distribution packages

## 0.0.7 (Nov 15th, 2019)

### Changelog

- Fixes location of the typescript declaration in the root package.json

## 0.0.6 (Nov 15th, 2019)

### Changelog

- Initial working release

## 0.0.2 (Nov 12th, 2019)

### Changelog

- Initial publish release, merging code from internal repo's
