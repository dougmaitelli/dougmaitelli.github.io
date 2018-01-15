const webpack = require("webpack");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const path = require("path");

module.exports = {
  entry: {
    "app.bundle": "./src/js/app.js",
    "app.bundle.min": "./src/js/app.js"
  },
  devtool: "source-map",
  output: {
    path: __dirname + "/build",
    filename: "[name].js"
  },
  resolve: {
    alias: {
      "../../theme.config$": path.join(__dirname, "theme/theme.config")
    }
  },
  module: {
    rules: [
      {
        use: ExtractTextPlugin.extract({
          use: ["css-loader", "less-loader"]
        }),
        test: /\.less$/
      },
      {
        test: /\.css$/,
        use: [{ loader: "style-loader" }, { loader: "css-loader" }]
      },
      {
        test: /\.jpe?g$|\.gif$|\.png$|\.ttf$|\.eot$|\.svg$/,
        use: "file-loader?name=[name].[ext]?[hash]"
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: "url-loader?limit=10000&mimetype=application/fontwoff"
      },
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["env"]
          }
        }
      }
    ]
  },
  plugins: [
    /*new webpack.optimize.UglifyJsPlugin({
      include: /\.min\.js$/,
      minimize: true
    }),*/
    new ExtractTextPlugin({
      filename: "[name].[contenthash].css"
    }),
    new HtmlWebpackPlugin({
      chunks: ["app.bundle.min"],
      template: "./src/index.html"
    })
  ],
  devServer: {
    inline: true
  }
};
