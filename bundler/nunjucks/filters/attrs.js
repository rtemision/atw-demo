const nunjucks = require('nunjucks/browser/nunjucks-slim');

/**
 * @source https://github.com/bem/bem-xjst/blob/master/lib/bemxjst/utils.js
 */

const matchAttrRegExp = /["&<>]/;
const matchJsAttrRegExp = /['&]/;


const amp = '&amp;';
const lt = '&lt;';
const gt = '&gt;';
const quot = '&quot;';
const singleQuot = '&#39;';

function isEmpty(string) {
  return typeof string === 'undefined' ||
     string === null ||
     (typeof string === 'number' && isNaN(string));
}

/**
 * regexp for check may attribute be unquoted
 *
 * https://www.w3.org/TR/html4/intro/sgmltut.html#h-3.2.2
 * https://www.w3.org/TR/html5/syntax.html#attributes
 */
 const UNQUOTED_ATTR_REGEXP = /^[:\w.-]+$/;

const utils = {
  isObj: function(val) {
    return val && typeof val === 'object' && !Array.isArray(val) &&
      val !== null;
  },

  isSimple: function isSimple(obj) {
    if (!obj ||
        obj === true ||
        typeof obj === 'string' ||
        typeof obj === 'number')
      return true;

    if (!obj.block &&
        !obj.elem &&
        !obj.tag &&
        !obj.cls &&
        !obj.attrs &&
        obj.hasOwnProperty('html') &&
        isSimple(obj.html))
      return true;

    return false;
  },

  jsAttrEscape: function(string) {
    if (isEmpty(string))
      return '';

    var str = '' + string;
    var match = matchJsAttrRegExp.exec(str);

    if (!match)
      return str;

    var escape;
    var html = '';
    var index = 0;
    var lastIndex = 0;

    for (index = match.index; index < str.length; index++) {
      switch (str.charCodeAt(index)) {
        case 38: // &
          escape = amp;
          break;
        case 39: // '
          escape = singleQuot;
          break;
        default:
          continue;
      }

      if (lastIndex !== index)
        html += str.substring(lastIndex, index);

      lastIndex = index + 1;
      html += escape;
    }

    return lastIndex !== index ?
      html + str.substring(lastIndex, index) :
      html;
  },

  attrEscape: function(string) {
    if (isEmpty(string))
      return '';

    var str = '' + string;
    var match = matchAttrRegExp.exec(str);

    if (!match)
      return str;

    var escape;
    var html = '';
    var index = 0;
    var lastIndex = 0;

    for (index = match.index; index < str.length; index++) {
      switch (str.charCodeAt(index)) {
        case 34: // "
          escape = quot;
          break;
        case 38: // &
          escape = amp;
          break;
        case 60: // <
          escape = lt;
          break;
        case 62: // >
          escape = gt;
          break;
        default:
          continue;
      }

      if (lastIndex !== index)
        html += str.substring(lastIndex, index);

      lastIndex = index + 1;
      html += escape;
    }

    return lastIndex !== index ?
      html + str.substring(lastIndex, index) :
      html;
  },

  isUnquotedAttr: function(str) {
    return str && UNQUOTED_ATTR_REGEXP.exec(str);
  }
}

/**
 *
 * @source https://github.com/bem/bem-xjst/blob/master/lib/bemhtml/index.js
 */

const options = {
  _unquotedAttrs: false,
  _singleQuotesForDataAttrs: true
};

function renderAttrs(attrs) {
  var out = '';

  // NOTE: maybe we need to make an array for quicker serialization
  if (utils.isObj(attrs)) {

    /* jshint forin : false */
    for (var name in attrs) {
      var attr = attrs[name];
      if (attr === undefined || attr === false || attr === null)
        continue;

      if (attr === true) {
        out += ' ' + name;
      } else {
        var attrVal = attr; //utils.isSimple(attr) ? attr : this.run(attr);
        out += ' ' + name + '=';
        out += (options._singleQuotesForDataAttrs && ['data-params', 'data-lit-params', 'data-validators'].indexOf(name) > -1) ?
          // getAttrValue(attrVal, utils.jsAttrEscape(attrVal), '\'') :
          getAttrValue(attrVal, utils.jsAttrEscape(JSON.stringify(attrVal)), '\'') :
          getAttrValue(attrVal, utils.attrEscape(attrVal), '"');
      }
    }
  }

  return out;
};

function getAttrValue(attrVal, escapedAttrVal, quote) {
  return options._unquotedAttrs && utils.isUnquotedAttr(attrVal) ?
    attrVal :
    (quote + escapedAttrVal + quote);
};

module.exports = function(attrs) {
  return new nunjucks.runtime.SafeString(renderAttrs(attrs));
};
