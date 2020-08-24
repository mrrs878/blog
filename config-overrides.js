const { override, fixBabelImports, addLessLoader, addWebpackAlias, addWebpackModuleRule, addWebpackPlugin } = require('customize-cra');
const RawLoader = require('raw-loader');
const path = require('path');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
function resolve(dir) {
  return path.join(__dirname, '.', dir)
}

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
  addWebpackAlias({
    "@": resolve("src")
  }),
  addWebpackModuleRule({test: /\.md$/, use: 'raw-loader'}),
  addWebpackPlugin(new HardSourceWebpackPlugin())
);
