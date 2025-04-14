const path = require("path")
const webpack = require('webpack')
function myResolve(dir) {
    return path.join(__dirname, dir);
}
module.exports = {
    publicPath: './',
    assetsDir: 'static',
    productionSourceMap: false,
    configureWebpack:{
        plugins:[
            new webpack.ProvidePlugin({
                Buffer: ['buffer', 'Buffer']
              })
            ],
    },
    // 自定义网页图标
    pwa: {
        iconPaths: {
            favicon32: "./public/img/logo.ico",
            favicon16: "./public/img/logo.ico",
            appleTouchIcon: "./public/img/logo.ico",
            maskIcon: "./public/img/logo.ico",
            msTileImage: "./public/img/logo.ico",
        }
    },
    chainWebpack: config => {
        config.resolve.alias
            .set("@", myResolve("src"))
            .set("@assets", myResolve("src/assets"))
            .set("@components", myResolve("src/components"))
            .set("@utils", myResolve("src/utils"))
            .set("@store", myResolve("src/store"));
        config.module
            .rule('images')
            .use('url-loader')
            .loader('url-loader')
            .tap(options => Object.assign(options, { limit: 2000, esModule: false }));
    },
    devServer: {
	port: 8082,
        proxy: {
            '/baseUrl':{
                target:'http://localhost:8000/',
                changeOrigin:true,
                pathRewrite:{
                    '^/baseUrl':''
                }
            }
        },
    },
}