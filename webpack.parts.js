// Constants
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const webpack = require("webpack");
const GitRevisionPlugin = require("git-revision-webpack-plugin");
const UglifyWebpackPlugin = require("uglifyjs-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const cssnano = require("cssnano");
const PurifyCSSPlugin = require("purifycss-webpack");

/**
 * * Configuración de Webpack Dev Server
 * * devServer
 * @ stats. "errors-only". Despliega sólo errores para reducir el outpur
 * @ host: Por defecto Localhost.
 * @ port: Por defecto 8080
 * @ open: Abre la página en el navegador.
 * @ overlay: Permite que los errores aparezcan directamente en la ventana del navegador.
 */
exports.devServer = ({ host, port } = {}) => ({
    devServer: {
        stats: "errors-only",
        host,
        port,
        open: true,
        overlay: true
    }
});

// Styles
exports.loadSass = ({ include, exclude } = {}) => ({
    module: {
        rules: [
            {
                test: /\.(css|sass|scss)$/,
                include,
                exclude,
                use: ["style-loader", "css-loader", "sass-loader"]
            }
        ]
    }
});
exports.extractSass = ({ include, exclude, use = [] }) => {
    // Extract Sass to a file
    const plugin = new MiniCssExtractPlugin({
        filename: "./css/[name].min.[contenthash:4].css"
    });
    return {
        module: {
            rules: [
                {
                    test: /\.(css|sass|scss)$/,
                    include,
                    exclude,
                    use: [MiniCssExtractPlugin.loader].concat(use)
                }
            ]
        },
        plugins: [plugin]
    };
};
exports.autoprefix = () => ({
    loader: "postcss-loader",
    options: {
        plugins: () => [require("autoprefixer")()]
    }
});
exports.minifyCSS = ({ options }) => ({
    plugins: [
        new OptimizeCSSAssetsPlugin({
            cssProcessor: cssnano,
            cssProcessorOptions: options,
            canPrint: false
        })
    ]
});
exports.purifyCSS = ({ paths }) => ({
    // Elimina CSS no utilizado en la versión final del css disminuyendo su peso.
    plugins: [new PurifyCSSPlugin({ paths })]
});
// Images
exports.loadImages = ({ include, exclude, options } = {}) => ({
    module: {
        rules: [
            {
                test: /\.(png|jpg)$/,
                include,
                exclude,
                use: [
                    {
                        loader: "url-loader",
                        options
                    },
                    "image-webpack-loader" // Optimizar imágenes
                ]
            },
            {
                test: /\.svg$/,
                use: ["file-loader", "image-webpack-loader"]
            }
        ]
    }
});
// Fonts
exports.loadFonts = ({ include, exclude, options } = {}) => ({
    module: {
        rules: [
            {
                test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
                include,
                exclude,
                use: [
                    {
                        loader: "url-loader",
                        options
                    }
                ]
            }
        ]
    }
});
// JavaScript
exports.loadJavaScript = ({ include, exclude } = {}) => ({
    module: {
        rules: [
            {
                test: /\.js$/,
                include,
                exclude,
                use: "babel-loader"
            }
        ]
    }
});
exports.minifyJavaScript = () => ({
    optimization: {
        minimizer: [new UglifyWebpackPlugin({ sourceMap: true })]
    }
});
// SOURCEMAPS
exports.generateSourceMaps = ({ type }) => ({
    devtool: type
});
// CLEANING UP
exports.clean = path => ({
    plugins: [new CleanWebpackPlugin()]
});
// ADD REVISIONS TO BUNDLED FILES
exports.attachRevision = () => ({
    plugins: [
        new webpack.BannerPlugin({
            banner: new GitRevisionPlugin().version()
        })
    ]
});
