const webpack = require('webpack');

module.exports = {
  plugins: [
    new webpack.DefinePlugin({
      VERSION: JSON.stringify(require('./package.json').version)
    })
  ]
};
