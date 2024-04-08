const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
 
module.exports = {
 webpack: (config, { isServer }) => {
   if (isServer) {
     config.plugins.push(new NodePolyfillPlugin());
   }
   return config;
 },
};
