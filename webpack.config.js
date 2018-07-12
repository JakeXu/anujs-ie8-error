const path = require('path')
const es3ifyPlugin = require('es3ify-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    entry: {
        index: path.resolve(__dirname, './src/index.js')
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js'
    },
    resolve: {
        extensions: ['.js', '.json', '.jsx'],
        alias: {
            'react': 'anujs/dist/ReactIE.js',
            'react-dom': 'anujs/dist/ReactIE.js',
            'prop-types': 'anujs/lib/ReactPropTypes.js',
            'create-react-class': 'anujs/lib/createClass.js'
        }
    },
    devtool: 'source-map',//不使用eval方便调试
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['es2015-loose', 'react'],
                        plugins: [
                            'transform-class-properties',
                            [
                                'transform-es2015-classes',
                                {
                                    loose: true
                                }
                            ]
                        ]
                    }
                }
            }
        ]
    },
    mode: 'development',
    plugins: [
        new es3ifyPlugin(),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: path.resolve(__dirname, 'template/index.html'),
            inject: 'body',
            hase: false,
            minify: {
                // 压缩HTML文件
                removeComments: true, // 移除HTML中的注释
                collapseWhitespace: false // 删除空白符与换行符
            },
            chunks: ['index']
        })],
    /*设置api转发*/
    devServer: {
        host: '0.0.0.0',
        port: 9528,
        compress: true, // 开启Gzip压缩
        hot: true,
        inline: true,
        stats: {
            colors: {
                green: '\u001b[32m'
            }
        },
        contentBase: path.resolve(__dirname, 'dll'),
        historyApiFallback: true,
        disableHostCheck: true,
        proxy: {
            '/security': {
                changeOrigin: true,
                target: 'http://10.72.100.40:8280',
                secure: false
            },
            '/develop': {
                changeOrigin: true,
                target: 'http://10.72.100.40:8281',
                secure: false
            },
            '/modeling': {
                changeOrigin: true,
                target: 'http://10.72.100.40:8282',
                secure: false
            },
            '/data-engine': {
                changeOrigin: true,
                target: 'http://10.72.100.40:8283',
                secure: false
            },
            '/monitor': {
                changeOrigin: true,
                target: 'http://10.72.100.40:8284',
                secure: false
            }
        },
        /*打开浏览器 并打开本项目网址*/
        after() {
            // opn('http://localhost:' + this.port);
        }
    }
}
