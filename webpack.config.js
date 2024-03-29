// webpack.config.js
const path = require('path');

module.exports = {
    entry: './src/index.js', // Entry point of your application
    output: {
        path: path.resolve(__dirname, 'dist'), // Output directory
        filename: 'bundle.js' // Output file name
    },
    mode: 'development' // Set mode to development or production
};
