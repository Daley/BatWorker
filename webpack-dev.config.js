var webpack = require("webpack");

module.exports = [
    {
        //name: "browser",
        entry: {
            main: './src/main.js'
        },
        output: {
            path: './public',
            filename: 'bundle.js'
        },
        debug: true,
        module: {
            loaders: [
               // { test: /\.js$/, loader: 'jsx-loader?harmony&insertPragma=React.DOM' },
                    {test: /\.js?$/, exclude: /(node_modules|bower_components)/,loader: 'babel'},
                { test: /\.css$/, loader: "style-loader!css-loader" },
                { test: /\.less$/, loader: "style-loader!css-loader!less-loader"},
                { test: /\.(eot|woff|ttf|svg|png|jpg|gif)([\?]?.*)$/, loader: 'url-loader' }
            ]
        },
        externals: {
            // require("jquery") is external and available
            //  on the global var jQuery
            "jquery": "jQuery"
        },
        externals:{
             fs: 'require("fs")',
             child_process:'require("child_process")',
             constants:'require("constants")',
             'nw.gui':'require("nw.gui")',
             process:'require("process")',
             path:'require("path")'
        },
        ddnode: {
           
            constants:"empty"
        },
        console: true,
        global: true,
        process: true,
        Buffer: true,
         __filename: "mock",
         __dirname: "mock",
        setImmediate: true
    }
];

