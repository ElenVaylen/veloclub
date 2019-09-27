const path = require("path");
const webpack = require('webpack');

module.exports = {
	output: {
		filename: "[name].js"
	},

	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: "babel-loader",
					query: {
						presets: [
							["@babel/preset-env", { modules: false }]
						]
					}
				}
			}
		]
	},

	resolve: {
		alias: {
			"%modules%": path.resolve(__dirname, "src/blocks/modules"),
			"%components%": path.resolve(__dirname, "src/blocks/components")
		}
	},
	plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
			jQuery: 'jquery',
			jquery: 'jquery',
			"window.jQuery": "jquery",
			"window.jquery": "jquery"
		}),
	]
};