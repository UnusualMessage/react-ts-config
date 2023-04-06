const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  output: {
    filename: "./static/js/[name].[contenthash].js",
    path: path.resolve(__dirname, "../build"),
    publicPath: "/",
  },

  mode: "production",

  devtool: false,

  performance: {
    hints: "error",
    maxAssetSize: 1048576,
    maxEntrypointSize: 2 * 1048576,
  },

  optimization: {
    chunkIds: "deterministic",
    moduleIds: "deterministic",
    runtimeChunk: "single",
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: "modules",
          chunks: "initial",
        },
      },
    },
  },

  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "../public"),
          to: "[path][name][ext]",
          noErrorOnMissing: true,
          globOptions: {
            dot: true,
            gitignore: true,
            ignore: ["**.html"],
          },
        },
      ],
    }),
  ],

  module: {
    strictExportPresence: true,

    rules: [
      {
        test: /\.(css|sass|scss)$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
        exclude: /\.module\.(css|scss|sass)$/i,
      },

      {
        test: /\.(css|sass|scss)$/i,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              importLoaders: 1,
              esModule: true,
              modules: {
                namedExport: true,
                mode: "local",
                localIdentName: "[hash:base64:5]",
              },
            },
          },
          "sass-loader",
        ],
        include: /\.module\.(css|scss|sass)$/i,
      },
    ],
  },
};
