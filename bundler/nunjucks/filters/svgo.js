const { optimize } = require('svgo');
const nunjucks = require('nunjucks/browser/nunjucks-slim');

module.exports = function(svgString) {
  const result = optimize(svgString, require('../../../svgo.config'));
  return new nunjucks.runtime.SafeString(result.data);
};
