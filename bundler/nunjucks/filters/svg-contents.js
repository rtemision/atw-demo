const path = require('path');
const GetSVGContents = require('eleventy-plugin-svg-contents/src/getSvgContents');
const nunjucks = require('nunjucks/browser/nunjucks-slim');

module.exports = function(file, className, extractTag = 'svg') {
  const getSVGContents = new GetSVGContents(path.join(__dirname, file), className, extractTag);
  return new nunjucks.runtime.SafeString(getSVGContents.getSvg());
};
