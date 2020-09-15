const { override, fixBabelImports, addLessLoader, addWebpackModuleRule, addWebpackPlugin } = require('customize-cra');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
const webpack = require('webpack')

module.exports = override(
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: true,
  }),
  addLessLoader({
    localIdentName: '[local]--[hash:base64:5]',
    javascriptEnabled: true
  }),
  addWebpackModuleRule({test: /\.md$/, use: 'raw-loader'}),
  addWebpackPlugin(new HardSourceWebpackPlugin()),
  addWebpackPlugin(new webpack.optimize.ModuleConcatenationPlugin())
);
