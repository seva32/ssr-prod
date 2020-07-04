import path from "path";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
// import HTMLWebpackPlugin from "html-webpack-plugin";
// import HtmlWebpackPrerenderPlugin from "html-webpack-prerender-plugin";
import { CleanWebpackPlugin } from "clean-webpack-plugin";
import webpack from "webpack";
import config from "./webpack.config.babel";

const devMode = process.env.NODE_ENV !== "production";

export default {
  devtool: "source-map",

  target: "node",

  entry: {
    app: path.resolve("src/App"),
    rootReducer: path.resolve("src/reducers/index"),
  },

  output: {
    ...config.output,
    filename: "[name].server.js",
    libraryTarget: "umd",
  },

  mode: "production",

  resolve: {
    alias: {
      react: path.resolve("./node_modules/react"),
    },
    ...config.resolve,
  },

  // externals: ["react-helmet-async"],

  module: {
    rules: [
      {
        test: /\.module\.s(a|c)ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: process.env.NODE_ENV === "development",
            },
          },
          { loader: "css-loader", options: { importLoaders: 1 } },
          "postcss-loader",
          "sass-loader",
        ],
      },
      {
        test: /\.(sa|sc|c)ss$/,
        exclude: /\.module.(s(a|c)ss)$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: process.env.NODE_ENV === "development",
            },
          },
          { loader: "css-loader", options: { importLoaders: 1 } },
          "postcss-loader",
          "sass-loader",
        ],
      },
      ...config.module.rules,
    ],
  },

  plugins: [
    new MiniCssExtractPlugin({
      filename: devMode ? "[name].css" : "[name].[hash].css",
      chunkFilename: devMode ? "[id].css" : "[id].[hash].css",
    }),
    new CleanWebpackPlugin({ cleanOnceBeforeBuildPatterns: ["build"] }),
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: "'production'"
      }
    }),
    ...config.plugins,
  ],
};
