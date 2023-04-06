const path = require("path");
const { merge } = require("webpack-merge");

const commonConfig = require(path.resolve(__dirname, "webpack.common.config.js"));

module.exports = (env) => {
  const config = require(path.resolve(__dirname, `webpack.${env.state}.config.js`));
  return merge(commonConfig, config);
};
