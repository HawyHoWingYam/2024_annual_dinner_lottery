const webpack = require("webpack");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const path = require("path");

module.exports = {
  entry: path.join(__dirname, "/src/lottery/index.js"),
  output: {
    path: path.join(__dirname, "/dist"),
    filename: "lottery.js",
    clean: true
  },
  module: {
    rules: [
      {
        test: /(\.jsx|\.js)$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ['@babel/preset-env']
          }
        },
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader", "postcss-loader"]
      }
    ]
  },
  plugins: [
    new webpack.BannerPlugin("版权所有，翻版必究"),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "/src/index.html"),
      filename: "./index.html"
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: "src/img", to: "img", globOptions: { ignore: ["**/.DS_Store"] } },
        { from: "src/worker", to: "worker", globOptions: { ignore: ["**/.DS_Store"] } },
        { from: "src/lottery/stage-design-prototype.html", to: "lottery/stage-design-prototype.html" },
        { from: "src/lottery/storyboard", to: "lottery/storyboard", globOptions: { ignore: ["**/.DS_Store"] } }
      ]
    })
  ]
};
