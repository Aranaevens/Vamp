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
                            'primary-color': '#C26C6B',
                            'link-color': '#C26C6B',
                            'border-color': '#444243',
                            'body-background': '#F9F4F0',
                            'component-background': '#F9F4F0',
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