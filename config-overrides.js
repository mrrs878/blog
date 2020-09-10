const { override, fixBabelImports, addLessLoader, addWebpackAlias, addWebpackModuleRule, addWebpackPlugin } = require('customize-cra');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');

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
  addWebpackPlugin(new HardSourceWebpackPlugin())
);
