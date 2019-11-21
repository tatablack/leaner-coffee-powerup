module.exports = function babelConfiguration(api) {
  api.cache(true);

  const presets = [['@babel/preset-env', {
    exclude: ['@babel/plugin-transform-regenerator']
  }]];

  const plugins = [
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-transform-async-to-generator'
  ];

  return {
    presets,
    plugins
  };
};
