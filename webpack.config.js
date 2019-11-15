module.exports = {
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: [{
                    loader: "babel-loader"
                },]
            },
            {
                test: /\.less$/,
                use: [{
                    loader: 'style-loader',
                }, {
                    loader: 'css-loader', // translates CSS into CommonJS
                }, {
                    loader: 'less-loader', // compiles Less to CSS
                    options: {
                        modifyVars: {
                            'primary-color': '#114006',
                            'link-color': '#114006',
                            'body-background': '#cccccc',
                            'component-background': '#cccccc',
                            'border-radius-base': '2px',
                            // 'hack': `true; @import "frontend/static/frontend/antstyle.less";`,
                        },
                        javascriptEnabled: true,
                    },
                }
                ]
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }
        ]
    }
};