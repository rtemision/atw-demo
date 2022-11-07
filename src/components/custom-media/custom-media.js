const mediaQueries = require('../media-queries/media-queries');

const getCustomMedia = () => {
  let cs = mediaQueries;

  Object.keys(cs).forEach(key => {
    delete Object.assign(cs, {['--' + key]: cs[key] })[key];
  });

  return cs;
};

module.exports = {
  customMedia: {
    '--hover': '(any-hover: hover)',
    ...getCustomMedia()
  }
};
