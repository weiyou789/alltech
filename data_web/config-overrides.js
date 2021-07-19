// 拓展功能  或者 reject 暴露内部的配置
// 这里是第三方 react -  rewried
// 装饰器的配置
// UI库的配置
// const {
//     override,
//     addDecoratorsLegacy,
//     disableEsLint,
//     addBundleVisualizer,
//     addWebpackAlias,
//     adjustWorkbox
// } = require("customize-cra");

// const path = require('path');
// function resolve (dir) {
//     return path.join(__dirname, '.', dir)
// }
const {
    useBabelRc,
    override,
    addDecoratorsLegacy,
    disableEsLint,
    addBundleVisualizer,
    addWebpackAlias,
    adjustWorkbox,
    // fixBabelImports,
    // addPostcssPlugins
} = require("customize-cra");
const path = require("path");

module.exports = override(
    useBabelRc(),// add .babelrc 添加可选链、空值合并运算符
    // enable legacy decorators babel plugin
    addDecoratorsLegacy(),

    // disable eslint in webpack
    disableEsLint(),

    // add webpack bundle visualizer if BUNDLE_VISUALIZE flag is enabled
    process.env.BUNDLE_VISUALIZE == 1 && addBundleVisualizer(),

    // add an alias for "ag-grid-react" imports
    addWebpackAlias({
        '@': path.join(__dirname, "src"),

    }),
    /*fixBabelImports('import', {
        libraryName: 'antd-mobile',
        style: 'css',
    }),
    addPostcssPlugins([
        require("postcss-px2rem")({ remUnit: 37.5 })
    ]),*/
    // adjust the underlying workbox
    adjustWorkbox(wb =>
        Object.assign(wb, {
            skipWaiting: true,
            exclude: (wb.exclude || []).concat("index.html")
        })
    )
);