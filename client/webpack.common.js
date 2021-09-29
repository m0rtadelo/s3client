const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './src/index.ts',
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    chunkFilename: '[name].chunk.js',
    clean: true,
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns:
        [
          {
            from: 'assets/*.png',
            to: '.',
          },
          {
            from: 'assets/*.icns',
            to: '.',
          },
          {
            from: '*.ico',
            // to: path.resolve(__dirname, 'dist'),
            to: './assets',
            toType: 'dir',
          },
        ],
    }),
    new HtmlWebpackPlugin({
      template: 'index.html',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.html$/i,
        loader: 'html-loader',
      },
      {
        test: /\.js$/i,
        exclude: /node_modules/,
        type: 'asset/inline',
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|jpg|gif)$/i,
        type: 'asset',
      },
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: 'url-loader',
        type: 'asset',
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  optimization: {
    splitChunks: { chunks: 'all' },
  },
};
