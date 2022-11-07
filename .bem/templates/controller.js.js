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

/**
 * TODO: Пофиксить создание компонентов в имени, которых содержится дефис
 * Сейчас требуется ручное редактирование имени класса (удаления этого дефиса)
 */
module.exports = function(entity, naming) {
  const name = naming.stringify({
    block: entity.block,
    elem: entity.elem
  });

  const nameArr = name.split('__').map(el => normalize(el, naming));

  let className = nameArr.join('');

  if (entity.modName) {
    className += toCamelCase(entity.modName) + (
      typeof entity.modVal === 'boolean' ? '' : toCamelCase(entity.modVal));
  }

  const result = [
    `export class ${className}Controller {`,
    "",
    "  constructor(host) {",
    "    (this.host = host).addController(this);",
    "  }",
    "",
    "  hostConnected() {",
    "    ",
    "  }",
    "",
    "  hostDisconnected() {",
    "    ",
    "  }",
    "}",
    ""
  ];

  return result.join(EOL);
};
