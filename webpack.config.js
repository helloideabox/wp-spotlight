const path = require( 'path' );
const MiniCssExtractPlugin = require( 'mini-css-extract-plugin' );
const webpack = require( 'webpack' );

const config = {
	// Entry point.
	entry: {
		frontend: ['./src/index.js'],
	},

	// Output single file.
	output: {
		path: path.resolve( __dirname, 'build' ),
		filename: '[name].js',
	},

	// Setting mode for webpack.
	mode: 'development',

	// Setting rules for modules.
	module: {
		rules: [
			{
				test: /\.js$/,
				use: {
					loader: 'babel-loader',
				}
			},
			{
				test: /\.(css|scss)$/,
				use: [
					{
						loader: MiniCssExtractPlugin.loader
					},
					'css-loader',
					{
						loader: 'postcss-loader',
						options: {
							plugins: [require( 'autoprefixer' )],
						}
					},
					'sass-loader',
				]
			},
			{
				test: /\.(png|svg|jpg|gif)$/,
				use: [
						'file-loader',
					],
				},
		]
	},
	plugins: [
		new MiniCssExtractPlugin( {
			filename: 'frontend.css'
		} )
	]

}

module.exports = config;
