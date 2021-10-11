const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin'), path = require('path'), webpack = require('webpack');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'app.js'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  plugins: [
    new MonacoWebpackPlugin()//,
    //new webpack.ProvidePlugin({ BrowserFS: require.resolve('browserfs'), fs: 'browserfs/dist/shims/fs.js', path: 'browserfs/dist/shims/path.js', Buffer: 'browserfs/dist/shims/buffer.js', process: 'browserfs/dist/shims/process.js' })
  ]
};
