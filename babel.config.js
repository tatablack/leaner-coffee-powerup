module.exports = function babelConfiguration(api) {
  api.cache(true);

  const presets = [['@babel/preset-env', {
    exclude: ['@babel/plugin-transform-regenerator']
  }]];

  const plugins = [
    ['module:fast-async', {
      runtimePattern: 'LeanCoffeePowerUp\\.js'
    }],
    '@babel/plugin-proposal-class-properties'
  ];

  return {
    presets,
    plugins
  };
};
