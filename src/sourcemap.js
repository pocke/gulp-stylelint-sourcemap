/**
 * Gulp stylelint sourcemap.
 * @module gulp-stylelint/sourcemap
 */

import {findIndex, flatMap} from 'lodash';
import {SourceMapConsumer} from 'source-map';
import buildConfig from 'stylelint/dist/buildConfig';
import minimatch from 'minimatch';
import path from 'path';

/**
 * @param{Object} lintResult - Result of StyleLint.
 * @param{Function} originalPositionFor - A function to translate position
 * @return {Object} Same as lintResult structure.
 */
function _applySourcemap(lintResult, originalPositionFor) { // eslint-disable-line
  const results = flatMap(lintResult.results, result => {
    return result.warnings.map(warn => {
      const origPos = originalPositionFor(warn);
      return Object.assign({}, warn, origPos);
    }).reduce((sum, warn) => {
      const source = warn.source || result.source;
      delete warn.source;
      const idx = findIndex(sum, r => r.source === source);
      if (idx === -1) {
        const ret = Object.assign({}, result, {
          source,
          warnings: [warn]
        });
        sum.push(ret);
      } else {
        sum[idx].warnings.push(warn);
      }
      return sum;
    }, []);
  });

  return Object.assign({}, lintResult, {results});
}

/**
 * @param{Object} lintResult - Result of StyleLint.
 * @return {Promise<Object>} A promise same as lintResult structure.
 */
function rejectIgnoredFiles(lintResult) {
  return buildConfig({}).then(config =>
    new Promise(resolve => {
      const patterns = config.config.ignoreFiles;
      if (!patterns) {
        resolve(lintResult);
        return;
      }

      lintResult.results = lintResult.results.filter(result => {
        // pattern is an abosolute pattern.
        // So, absoluteize source
        const source = path.join(process.cwd(), result.source);
        return !patterns.some(pattern => minimatch(source, pattern));
      });
      resolve(lintResult);
    })
  );
}

/**
 * Applies sourcemap to lint result if exists.
 *
 * @param{Object} lintResult - Result of StyleLint.
 * @param{SourceMap} sourceMap - Raw source map object.
 * @return {Promise<Object>} A promise same as lintResult structure.
 */
function applySourcemap(lintResult, sourceMap) {
  if (!sourceMap) {
    return lintResult;
  }
  const sourceMapConsumer = new SourceMapConsumer(sourceMap);
  const originalPositionFor = sourceMapConsumer.originalPositionFor.bind(sourceMapConsumer);
  lintResult = _applySourcemap(lintResult, originalPositionFor);
  return rejectIgnoredFiles(lintResult);
}

module.exports = {
  _applySourcemap,
  applySourcemap
};