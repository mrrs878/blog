const { override, fixBabelImports, addLessLoader, addWebpackAlias, addWebpackModuleRule } = require('customize-cra');
const RawLoader = require('raw-loader');
const path = require('path');
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
  addWebpackModuleRule({test: /\.md$/, use: 'raw-loader'})
);
