const createExpoWebpackConfigAsync = require('@expo/webpack-config');
const path = require('path');
// Expo CLI will await this method so you can optionally return a promise.
module.exports = async function(env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);
  // If you want to add a new alias to the config.
  config.resolve.alias['react-native'] = 'react-native-web';
  // TODO: Include <script> from Google Maps ()
  config.resolve.alias['react-native-maps'] = path.resolve(__dirname, 'components/web/maps/index.tsx');
  config.resolve.alias['react-native-searchable-dropdown'] = path.resolve(__dirname, 'components/web/select/index.tsx');

  // Create local server configuration to avoid CORS
  if (config.mode === 'development') {
    config.devServer.headers= {
      'Access-Control-Allow-Origin': '*',
    }
  }
  // Finally return the new config for the CLI to use.
  return config;
};