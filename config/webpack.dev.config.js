const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const fs = require("fs");

module.exports = {
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "../build-dev"),
    publicPath: "/",
  },

  mode: "development",

  devtool: "eval-source-map",

  performance: {
    hints: "warning",
  },

  devServer: {
    port: 3000,
    https: {
      key: fs.readFileSync("cert.key"),
      cert: fs.readFileSync("cert.crt"),
      ca: fs.readFileSync("ca.crt"),
    },

    static: {
      directory: path.resolve(__dirname, "../build-dev"),
    },

    proxy: {
      '/api': {
        target: 'https://localhost:5443',
        pathRewrite: { '^/api': '' },
        secure: false,
        changeOrigin: true
      },
    },

    client: {
      logging: "error",
      overlay: {
        errors: true,
        warnings: false,
      },
    },

    compress: true,
    historyApiFallback: true,
    open: ["https://localhost:3000/system/monitoring"],
    hot: true,
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
        use: ["style-loader", "css-loader", "sass-loader"],
        exclude: /\.module\.(css|scss|sass)$/i,
      },

      {
        test: /\.(css|sass|scss)$/i,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              importLoaders: 1,
              esModule: true,
              modules: {
                namedExport: true,
                mode: "local",
                localIdentName: "[name]__[local]__[hash:base64:5]",
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
