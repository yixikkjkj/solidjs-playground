
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = function (env, argv) {
  return {
    entry: './src/index.tsx',
    output: {
      publicPath: '/',  // publicPath，在引用的时候会使用这个publicPath
      path: path.resolve(__dirname, 'dist'),
      filename: 'index.js',
    },

    resolve: {
      // Add '.ts' and '.tsx' as resolvable extensions.
      extensions: [".ts", ".tsx", ".js", ".json"],
      alias: {
        '~': path.resolve(__dirname, './src'),  // 给~取一个别名，在webpack处理导入的时候会用到
      },
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                presets: ['solid'],
              },
            },
            { loader: 'ts-loader' },
          ],
        },
        {
          test: /\.s[ac]ss$/,
          use: [
            MiniCssExtractPlugin.loader,  // 生成css文件，使用style-loader会放到html中
            {
              loader: 'css-loader',  // 解析css
              options: {
                modules: {
                  localIdentName: argv.mode == 'development' ? '[path]-[local]' : '[hash:base64:8]',  // css token的名字，方便调试
                },
              },
            },
            'sass-loader',  // 解析sass
          ],
        },
      ],
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: '[name].css',
        chunkFilename: '[id].css',
      }),
      new HtmlWebpackPlugin({
        title: 'solid-webpack-template',
        template: './index.html.ejs',
        favicon: './favicon.ico',
      })
    ],
    devServer: {
      historyApiFallback: true,
      static: {
        directory: path.join(__dirname, 'dist'),
      },
    }
  };
}
