# gulp-stylelint-sourcemap

This repository is forked from [olegskl/gulp-stylelint](https://github.com/olegskl/gulp-stylelint).
It supports source map feature.

[![NPM version](http://img.shields.io/npm/v/gulp-stylelint-sourcemap.svg)](https://www.npmjs.org/package/gulp-stylelint-sourcemap)
[![Build Status](https://travis-ci.org/pocke/gulp-stylelint-sourcemap.svg?branch=master)](https://travis-ci.org/pocke/gulp-stylelint-sourcemap)
[![Dependency Status](https://david-dm.org/pocke/gulp-stylelint-sourcemap.svg)](https://david-dm.org/pocke/gulp-stylelint-sourcemap)

A [Gulp](http://gulpjs.com/) plugin that runs [stylelint](https://github.com/stylelint/stylelint) results through a list of reporters.

## Installation

```bash
npm install gulp-stylelint-sourcemap --save-dev
```

## Quick start

Once you have [configured stylelint](http://stylelint.io/user-guide/configuration/) (e.g. you have a *.stylelintrc* file), start with the following code. You will find additional configuration [options](#options) below.

```js
const gulp = require('gulp');

gulp.task('lint-css', function lintCssTask() {
  const gulpStylelint = require('gulp-stylelint-sourcemap');

  return gulp
    .src('src/**/*.css')
    .pipe(gulpStylelint({
      reporters: [
        {formatter: 'string', console: true}
      ]
    }));
});
```

## Formatters

Below is the list of currently available stylelint formatters. Some of them are bundled with stylelint by default and exposed on `gulpStylelint.formatters` object. Others need to be installed. You can [write a custom formatter](http://stylelint.io/developer-guide/formatters/) to tailor the reporting to your needs.

 - `"string"` (same as `gulpStylelint.formatters.string`) – bundled with stylelint
 - `"verbose"` (same as `gulpStylelint.formatters.verbose`) – bundled with stylelint
 - `"json"` (same as `gulpStylelint.formatters.json`) – bundled with stylelint
 -  [stylelint-checkstyle-formatter](https://github.com/davidtheclark/stylelint-checkstyle-formatter) – requires installation

## Options

gulp-stylelint-sourcemap supports all [stylelint options](http://stylelint.io/user-guide/node-api/#options) except [`files`](http://stylelint.io/user-guide/node-api/#files) and [`formatter`](http://stylelint.io/user-guide/node-api/#formatter) and accepts a custom set of options listed below:

```js
const gulp = require('gulp');

gulp.task('lint-css', function lintCssTask() {
  const gulpStylelint = require('gulp-stylelint-sourcemap');
  const myStylelintFormatter = require('my-stylelint-formatter');

  return gulp
    .src('src/**/*.css')
    .pipe(gulpStylelint({
      failAfterError: true,
      reportOutputDir: 'reports/lint',
      reporters: [
        {formatter: 'verbose', console: true},
        {formatter: 'json', save: 'report.json'},
        {formatter: myStylelintFormatter, save: 'my-custom-report.txt'}
      ],
      debug: true
    }));
});
```

#### `failAfterError`

When set to `true`, the process will end with non-zero error code if any error-level warnings were raised. Defaults to `true`.

#### `reportOutputDir`

Base directory for lint results written to filesystem. Defaults to current working directory.

#### `reporters`

List of reporter configuration objects (see below). Defaults to an empty array.

```js
{
  // stylelint results formatter (required):
  // - pass a function for imported, custom or exposed formatters
  // - pass a string ("string", "verbose", "json") for formatters bundled with stylelint
  formatter: myFormatter,

  // save the formatted result to a file (optional):
  save: 'text-report.txt',

  // log the formatted result to console (optional):
  console: true
}
```

#### `debug`

When set to `true`, the error handler will print an error stack trace. Defaults to `false`.

## Source map Support

The plugin supports source map feature.

### Translate file name, line and column

If a vinyl file object has a `sourcemap` field, this plugin translates file name, line and column of output.

### Ignore files

When `ignoreFiles` option is specified in stylelintrc, this plugin ignores the files.
`ignoreFiles` should be specified as a glob for **translated** file name.


## License

[MIT License](http://opensource.org/licenses/MIT)
