const path = require("path");

module.exports = {
  // outputDir sets the path where the production files will be created. In this case, we are setting it to ../server/public. They will be stored in a folder called public.
  outputDir: path.resolve(__dirname, "../server/public"),
  configureWebpack: {
    devtool: 'source-map'
  },
  devServer: {
    // These are the proxy settings for the dev server. It is currently set to the default IP address given by docker. You can also set it to localhost:8080 or wherever. In production, it should automatically use the correct IP address.
    proxy: {
      "/": {
        target: "http://localhost:8010/",
      },
    },
  },
};