import path from "path";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
// import HTMLWebpackPlugin from "html-webpack-plugin";
// import HtmlWebpackPrerenderPlugin from "html-webpack-prerender-plugin";
// import { CleanWebpackPlugin } from "clean-webpack-plugin";
import nodeExternals from "webpack-node-externals";
import webpack from "webpack";
import config from "./webpack.config.babel";

// if (!env || !env.MONGOOSE) {
//   throw new Error(
//     `You need to specify your tmdb api-key. You can do so by specifying
//       --env.apiKey=<yourkey> in the command line. For example:
//       $ npm run serve-dev  -- --env.apiKey=<yourkey>
//       or
//       $ npm run build-webpack -- --env.apiKey=<yourkey> && npm run serve-prod`
//   );
// }

export default (env) => ({
  devtool: "source-map",

  target: "node",

  entry: path.resolve("server/server.js"),
  // {
  // app: path.resolve("src/App"),
  // rootReducer: path.resolve("src/reducers/index"),
  // },

  output: {
    path: path.resolve("public"),
    filename: "bundle.server.js",
    libraryTarget: "commonjs2",
  },

  mode: "production",

  resolve: {
    alias: {
      react: path.resolve("./node_modules/react"),
    },
    ...config.resolve,
  },

  externals: [nodeExternals()],
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
      filename: "[name].[hash].css",
      chunkFilename: "[id].[hash].css",
    }),
    // new CleanWebpackPlugin({ cleanOnceBeforeBuildPatterns: ["build"] }),
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: "'production'",
      },
      "process.env.MONGOOSE": JSON.stringify((env && env.MONGOOSE) || ""),
      "process.env.PORT": JSON.stringify((env && env.PORT) || ""),
      "process.env.TOKEN_SECRET": JSON.stringify(
        (env && env.TOKEN_SECRET) || ""
      ),
      "process.env.REACT_APP_GOOGLE_ID": JSON.stringify(
        (env && env.REACT_APP_GOOGLE_ID) || ""
      ),
    }),
    ...config.plugins,
  ],
});
