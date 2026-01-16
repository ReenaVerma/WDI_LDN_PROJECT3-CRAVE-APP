const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: process.env.NODE_ENV || 'development',
  entry: './src/app.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'app.js',
    publicPath: '/'
  },
  module: {
    rules: [
      { test: /\.jsx?$/, use: 'babel-loader', exclude: /node_modules/ },
      { test: /\.css$/, use: ['style-loader', 'css-loader'] },
      {
        test: /\.s(a|c)ss$/,
        use: [
          'style-loader',
          'css-loader',
          { loader: 'sass-loader', options: { implementation: require('sass') } }
        ]
      },
      { test: /\.(eot|ttf|woff|woff2)$/, use: 'file-loader' },
      { test: /\.(png|jpe?g|gif|svg)$/, use: 'url-loader?limit=10000' }
    ]
  },
  devServer: {
    // contentBase: path.join(__dirname, 'src'),
    // watchContentBase: true,
    static: {
      directory: path.join(__dirname, 'src'), // your old contentBase
      watch: true,                             // replaces watchContentBase
    },
    hot: true,
    historyApiFallback: true,
    port: 8000,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        secure: false
      }
    }
  },
  resolve: {
    fallback: {
      buffer: require.resolve('buffer/'),
    },
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({ template: 'src/index.html', filename: 'index.html', inject: 'head' }),
    new CopyWebpackPlugin({ patterns: [{ from: './src/assets', to: 'assets' },{ from: './src/views', to: 'views' }]}),
    new webpack.ProvidePlugin({ Buffer: ['buffer', 'Buffer'] })
  ]
};
