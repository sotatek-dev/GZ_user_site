/** @type {import('next').NextConfig} */
const path = require('path');
const nextConfig = {
	reactStrictMode: true,
	// swcMinify: true,
	sassOptions: {
		includePaths: [path.join(__dirname, 'styles')],
	},
	cssModules: true,
	// env: {
	// 	// declare here all your variables
	// 	BASE_URL: process.env.BASE_URL,
	// },
};

module.exports = nextConfig;
