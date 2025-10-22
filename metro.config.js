const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// For web platform, prevent bundling MaterialIcons.ttf
if (process.env.EXPO_PUBLIC_PLATFORM === 'web') {
  config.transformer = {
    ...config.transformer,
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  };
}

module.exports = config;