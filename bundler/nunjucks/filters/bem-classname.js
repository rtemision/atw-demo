const classNames = require('@bem-react/classnames')['classnames'];
const className = require('@bem-react/classname');
const cn = className.withNaming({ n: '', e: '__', m: '_', v: '_' });

module.exports = function({ block, elem, mods, mix, classname }) {
  const cnBlock = cn(block, elem);
  const cnMixes =  mix ? [].concat(mix).map(item => {
    const cnItemBlock = cn(item.block, item.elem);
    return cnItemBlock(item.mods);
  }) : [];

  return classNames(cnBlock(mods, cnMixes), classname);
}
