module.exports = {
  entry: './src/index.js',
  output: {
    path: require('path').resolve(__dirname, 'dist'),
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
    new require('monaco-editor-webpack-plugin')(),
    new require('webpack').ProvidePlugin({ BrowserFS: require.resolve('browserfs'))
  ]
};
