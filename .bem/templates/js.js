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

function tagName(str) {
  return str
    .replace(/-/g, '-')
    .replace(/_+/g, '-')
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

  let className = `App${nameArr.join('')}`;

  if (entity.modName) {
    className += toCamelCase(entity.modName) + (
      typeof entity.modVal === 'boolean' ? '' : toCamelCase(entity.modVal));
  }

  const result = [
    "import { html, LitElement } from '@lion/core';",
    "import { BemEntityLitElementMixin } from '@components/bem-entity/_lit-element';",
    "",
    `export class ${className} extends BemEntityLitElementMixin(LitElement) {`,
    "",
    "  static properties = {",
    "    ",
    "  }",
    "",
    "  constructor() {",
    "    super();",
    `    this.bemEntityName = '${name}';`,
    "  }",
    "",
    "  connectedCallback() {",
    "    super.connectedCallback();",
    "  }",
    "",
    "  updated(changedProperties) {",
    "    super.updated?.(changedProperties);",
    "  }",
    "",
    "  render() {",
    "    return html`<slot></slot>`;",
    "  }",
    "}",
    "",
    `customElements.define('app-${tagName(name)}', ${className});`,
    ""
  ];

  return result.join(EOL);
};
