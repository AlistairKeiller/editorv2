const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin'), path = require('path'), webpack = require('webpack');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'app.js',
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new MonacoWebpackPlugin(),
    new webpack.ProvidePlugin({ BrowserFS: require.resolve('browserfs') })
  ]
};
