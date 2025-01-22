const { merge } = require("webpack-merge");
const baseConfig = require("./webpack.config");
const serve = require("../server/server.js");

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
    },
    onBeforeSetupMiddleware(devServer) {
      serve.run(18888, "n");
    }
  }
});