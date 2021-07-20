const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin");
const withCSS = require("@zeit/next-css");

module.exports = withCSS({
  webpack: (config) => {
    Object.assign(config, {
      target: "electron-renderer",
    });

    return config;
  },
});
