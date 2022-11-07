const merge = require('lodash.merge');
const basePath = './src/components/theme';
const path = require('path');
const fs = require('fs');
const styleDictionary = require('style-dictionary');
const platforms = [
  'common',
  'phone',
  'tablet',
  'desktop',
  'desktop-large'
];
const colorTokensPath = path.join(__dirname, basePath, 'tokens', 'color');
const colorTokensRegex = /\@([a-z0-9]+)\.tokens\.json/gi;
const colorGroup = ['color', 'effect'];
const cssParams = {
  transforms: ['attribute/cti', 'name/cti/kebab'],
  files: [{
    format: 'css/variables',
    options: {
      fileHeader: () => [
        'Do not edit directly',
        'this file generated from tokens'
      ],
      outputReferences: true
    }
  }]
};
const referencesToken = 'references.tokens.json';

const isNotReferences = (token) => {
  return token.filePath.indexOf(referencesToken) < 0;
};

function getStyleDictionaryConfig(platform) {
  const buildPath = `${basePath}/presets/default/${platform}/`;
  const source = platform === 'common' ? [
    `${basePath}/tokens/**/!(*@*|references).tokens.json`
  ] : [];

  source.push(`${basePath}/tokens/**/*@${platform}.tokens.json`);

  return {
    include: [
      `${basePath}/tokens/references/${referencesToken}`
    ],
    source: source,
    platforms: {
      'css': merge({ buildPath }, cssParams, {
        files: [{
          destination: 'root.css',
          options: {
            selector: '.theme_root_default'
          },
          filter: token => {
            return colorGroup.indexOf(token.group) < 0 && isNotReferences(token);
          }
        }]
      }),

      'css/color': merge({ buildPath }, cssParams, {
        files: [{
          destination: 'color.css',
          options: {
            selector: '.theme_color_default'
          },
          filter: token => {
            return ~colorGroup.indexOf(token.group) && isNotReferences(token);
          }
        }]
      })
    }
  };
}

console.log('Build started...');

platforms.forEach(platform => {
  console.log('\n==============================================');
  console.log(`\nProcessing: [${platform}]`);

  styleDictionary
    .extend(getStyleDictionaryConfig(platform))
    .buildAllPlatforms();

  console.log('\nEnd processing');
});

fs.readdir(colorTokensPath, (err, files) => {
  if (err) {
    return console.log('Unable to scan directory: ' + err);
  }

  files.forEach(file => {
    const matches = new RegExp(colorTokensRegex).exec(file);
    const colorType = matches ? matches[1] : '';

    if (colorType && colorType !== 'common') {
      console.log('\n==============================================');
      console.log(`\nProcessing: [color ${colorType}]`);

      styleDictionary.extend({
        source: [
          `${basePath}/tokens/color/${file}`
        ],
        platforms: {
          'css/color/override': merge({}, cssParams, {
            buildPath: `${basePath}/presets/default/common/`,
            files: [{
              destination: `color_override_${colorType}.css`,
              options: {
                selector: `.theme__color_override_${colorType}`
              },
              filter: token => {
                return ~colorGroup.indexOf(token.group);
              }
            }]
          })
        }
      }).buildAllPlatforms();

      console.log('\nEnd processing');
    }
  });


  console.log('\n==============================================');
  console.log('\nBuild completed!');
});
