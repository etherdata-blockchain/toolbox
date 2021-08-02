const withCSS = require("@zeit/next-css");

const path = require("path");

module.exports = {
  webpack: (config) => {
    Object.assign(config, {
      target: "electron-renderer",
    });

    return config;
  },
};
