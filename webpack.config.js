var path = require("path");
var webpack = require("webpack");

console.log(path.resolve(__dirname));
var PATHS = {
    entryPoint: path.resolve(__dirname, "app/src/app.ts"),
    bundles: path.resolve(__dirname, "dist/js/lib")
};

var tsConfig = {
    entry: {
        "ld40": [PATHS.entryPoint],
        "ld40.min": [PATHS.entryPoint]
    },
    output: {
        path: path.resolve(__dirname, "dist/js"),
        filename: "[name].js",
        libraryTarget: "umd",
        library: "ECS",
        umdNamedDefine: true
    },
    resolve: {
        extensions: [".ts", ".js"]
    },
    devtool: "source-map",
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            minimize: true,
            sourceMap: true,
            include: /\.min\.js$/
        })
    ],
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: [{ loader: "ts-loader" }]
            }
        ]
    }
};

module.exports = [tsConfig];
