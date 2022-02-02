const webpack = require('webpack');
const variables = require(`./config/variables`);

module.exports = {
  transpileDependencies: [
    'vuetify'
  ],

  configureWebpack: {
    plugins: [
      new webpack.NormalModuleReplacementPlugin(/^mqtt$/, 'mqtt/dist/mqtt.js'),
      new webpack.EnvironmentPlugin(variables)
    ],
  }
}
