// webpack.dev.js
const { merge } = require("webpack-merge");
const baseConfig = require("./webpack.config");
const serve = require("../server/server.js");

// Start server before webpack configuration
serve.run(18888, "n");

module.exports = merge(baseConfig, {
  mode: 'development',
  devtool: 'eval-source-map',
  devServer: {
    hot: true,
    compress: true,
    port: 9000,
    open: true,
    proxy: {
      "*": "http://localhost:18888"
    }
    // Remove onBeforeSetupMiddleware to avoid double server start
  }
});