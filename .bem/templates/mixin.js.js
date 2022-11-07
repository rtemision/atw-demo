'use strict';

const EOL = require('os').EOL;

function toCamelCase(str) {
  return str.replace(str[0], str[0].toUpperCase());
}

function normalize(str, naming) {
  return str
  .replace(naming.elemDelim, ' ')
  .replace(naming.modDelim, ' ')
  .replace(/-+/, ' ') // word delimiter
  .split(' ')
  .map(toCamelCase).join('');
}

module.exports = function(entity, naming) {
  const name = naming.stringify({
    block: entity.block,
    elem: entity.elem
  });

  const nameArr = name.split('__').map(el => normalize(el, naming));

  let className = `${nameArr.join('')}Mixin`;
  let implementationName = `${className}Implementation`;

  if (entity.modName) {
    className += toCamelCase(entity.modName) + (
      typeof entity.modVal === 'boolean' ? '' : toCamelCase(entity.modVal));
  }

  const result = [
    "import { dedupeMixin } from '@lion/core';",
    "",
    `const ${implementationName} = base => class ${className} extends base {`,
    "",
    "}",
    "",
    `export const ${className} = dedupeMixin(${implementationName});`,
    ""
  ];

  return result.join(EOL);
};
