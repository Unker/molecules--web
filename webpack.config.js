const path = require('path')
const Dotenv = require('dotenv-webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
// const HtmlWebpackPlugin =require('html-webpack-plugin');
// const webpack =require('webpack');

module.exports = {
  entry: ['react-hot-loader/patch', './src/index.js'],
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist', 'build'),
  },
  devServer: {
    contentBase: './dist',
    publicPath: '/build/',
    historyApiFallback: true,
    open: true,
  },
  plugins:[
    new MiniCssExtractPlugin(), 
    new Dotenv({ systemvars: true }),
    // new HtmlWebpackPlugin(
    //   {template:'./dist/index.html'}
    // )
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      {
          test: /\.(jpg|png|gif|eot|svg)/,
          use: {
            loader: 'url-loader', // this need file-loader
            options: {
              limit: 50000
            },
          },
      },
      {
        test: /\.module\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: true,
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          { 
            loader: 'css-loader', 
            options: { modules: false } 
          },
        ],
        exclude: /\.module\.css$/,
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg|otf)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'fonts/',
            },
          },
        ],
      },
    ],
  },
  resolve: {
    alias: {
      'react-dom': '@hot-loader/react-dom',
      '@shared': path.resolve(__dirname, 'src/shared'),
      '@components': path.resolve(__dirname, 'src/shared/components'),
      '@utils': path.resolve(__dirname, 'src/shared/utils'),
      '@contexts': path.resolve(__dirname, 'src/shared/contexts'),
      '@hooks': path.resolve(__dirname, 'src/shared/hooks'),
      '@abis': path.resolve(__dirname, 'src/shared/abis'),
    },
  },
  optimization: {
    minimize: false
  },
}
