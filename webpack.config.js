
var webpack = require('webpack');
var htmlWebpackPlugin = require('html-webpack-plugin');
var app = {
    srcPath: './src/',
    devPath: 'build/',
    prdPath: 'dist/'
};

module.exports = {
    devtool: 'eval-source-map', //配置生成Source Map
    entry: app.srcPath+'app.js',
    output: {
        path: app.devPath,
        filename: 'js/index.js'
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader"
            },
            {
                test: /\.json$/,
                loader: 'json-loader'
            },
            {
                test:/\.css$/,
                loader: 'style-loader!css-loader?moduless!postcss-loader'
            },
            {
                test:/\.less$/,
                loader: 'style-loader!css-loader!postcss-loader!less-loader'
            },
            {
                test:/\.(png|jpg|gif|svg)$/i,
                loader: 'file-loader'
            },
            {
                test:/\.json$/,
                loader:'json-loader'
            }
        ]
    },
    plugins: [
        new htmlWebpackPlugin({
            filename: 'index.html',
            template: './src/index.html',
            inject: 'body'
        }),
        new webpack.LoaderOptionsPlugin({
            options: {
                postcss: [
                    require('autoprefixer')({
                        broewers: ['last 5 versions']
                    })
                ],
            }
        })
    ],
    devServer: {
        contentBase: './build',
        colors:true,
        historyApiFallback: true,
        inline:true
    }

}