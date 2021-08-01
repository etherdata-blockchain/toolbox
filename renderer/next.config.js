const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin");
const withCSS = require("@zeit/next-css");
const { loader } = "@monaco-editor/react";

const path = require("path");

module.exports = {
  webpack: (config) => {
    Object.assign(config, {
      target: "electron-renderer",
    });

    return config;
  },
};
