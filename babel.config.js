module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./src'],
          alias: {
            '@components': './src/components',
            '@screens': './src/screens',
            '@navigation': './src/navigation',
            '@services': './src/services',
            '@utils': './src/utils',
            '@models': './src/types',
            '@types': './src/types',
            '@hooks': './src/hooks'
          }
        }
      ],
      'react-native-reanimated/plugin'
    ]
  };
};
