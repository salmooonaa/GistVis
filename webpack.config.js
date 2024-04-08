const path = require('path');
 
module.exports = {
 entry: './src/index.js', // 入口文件
 output: {
   path: path.resolve(__dirname, 'dist'), // 输出目录
   filename: 'bundle.js', // 输出文件名
 },
 module: {
   rules: [
     {
       test: /\.js$/,
       use: 'babel-loader',
     },
   ],
 },
 resolve: {
  fallback: {
    "crypto": require.resolve("crypto-browserify"),
    "stream": require.resolve("stream-browserify")
  }
 }

};