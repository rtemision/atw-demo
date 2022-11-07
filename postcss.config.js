const { join } = require('path');

module.exports = {
  plugins: [
    'postcss-import',
    'postcss-each',
    'postcss-for',
    ['postcss-mixins', {
      mixinsDir: join(__dirname, 'src/**/mixins')
    }],
    ['postcss-custom-media', {
      importFrom: [
        require('./src/components/custom-media/custom-media'),
      ]
    }],
    // 'postcss-simple-vars', // has a confilct with postcss-each
    'postcss-calc',
    'postcss-nested',
    'autoprefixer',
    'postcss-color-function',
    ['postcss-url', [
      {
        filter: '**/@fontsource/**/*', url: 'rebase'
      },
      {
        filter: '!**/@fontsource/**/*', url: 'inline'
      }
    ]],
    'postcss-inline-svg',
    'postcss-em',
    ['postcss-pxtorem', {
      rootValue: 16,
      propList: [
        '--*',
        'font',
        'font-size',
        'line-height',
        'letter-spacing',
        'margin',
        'margin-top',
        'margin-left',
        'margin-right',
        'margin-bottom',
        'padding',
        'padding-top',
        'padding-left',
        'padding-right',
        'padding-bottom'
      ]
    }]
  ]
};
