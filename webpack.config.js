const createExpoWebpackConfigAsync = require('@expo/webpack-config');
const path = require('path');
// Expo CLI will await this method so you can optionally return a promise.
module.exports = async function(env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);
  // If you want to add a new alias to the config.
  config.resolve.alias['react-native'] = 'react-native-web';
  // TODO: Include <script> from Google Maps ()
  config.resolve.alias['react-native-maps'] = path.resolve(__dirname, 'components/web-maps/index.tsx');

  // Finally return the new config for the CLI to use.
  return config;
};