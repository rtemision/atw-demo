const merge = require('lodash.merge');

/**
 * @param {Object} object target
 * @param {Object[]} objects sources
 */
module.exports = function(object, objects) {
  [].concat(objects).forEach(item => {
    object = merge(object, item);
  });

  return object;
};
