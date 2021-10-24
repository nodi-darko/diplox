module.exports = {
    entry: __dirname + '/src/index.js',
    output: {
        path: __dirname + '/dist',
        publicPath: '/dist/',
        filename: 'bundle.js'
    },
    module: {
        rules: [{
            test: /\.html$/,
            exclude: /node_modules/,
            loader: "raw-loader"
            //use: 'babel-loader'
        }]
    }
};
