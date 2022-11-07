const EOL = require('os').EOL;

/**
 * TODO: Пофиксить создание компонентов в имени, которых содержится дефис
 * Сейчас требуется ручное редактирование имени макроса (удаления этого дефиса)
 *
 * @example diff
 * - {% macro embed-video(data) %}
 * + {% macro embedVideo(data) %}
 */
module.exports = ({ block, elem, modName, modVal }) => {
  const elemPart = elem ? `__${elem}` : '';
  const modValStr = modVal && (typeof modVal === 'boolean' ? '' : '_' + modVal) || '';
  const modPart = modName ? '_' + modName + modValStr : '';

  const className = [
    block,
    modName && !elem ? modPart : '',
    elem ? elemPart : '',
    elem && modName ? modPart : ''
  ].join('');
  return [
    `{% from 'dom-element/dom-element.njk' import domElement %}`,
    `{#`,
    `  @param {Object} data`,
    `#}`,
    `{% macro ${className}(data) %}`,
    `  {% set content %}`,
    `    `,
    `  {% endset %}`,
    ``,
    '  {{ domElement({',
    `    tag: '',`,
    `    bemEntity: {`,
    `      block: '${block}',`,
    `      elem: '${elem || ''}',`,
    `      mods: data.mods${modVal ? ` | merge({ ${modName}: '${modVal}' })` : ''},`,
    `      mix: data.mix,`,
    `      classname: data.classname`,
    `    },`,
    `    attrs: {`,
    `      `,
    `    },`,
    `    content: content`,
    `  }) }}`,
    '{% endmacro %}',
    ''
  ].join(EOL);
};
