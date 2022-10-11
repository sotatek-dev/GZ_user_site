/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
	reactStrictMode: false,
	sassOptions: {
		includePaths: [path.join(__dirname, 'styles')],
	},
	swcMinify: true,
	// compiler: {
	// 	removeConsole: {
	// 		exclude: ['error'],
	// 	},
	// },
	cssModules: true,
	images: {
		domains: ['api.galactix.sotatek.works', '172.16.1.217'],
		dangerouslyAllowSVG: true,
		// disableStaticImages: true,
		// unoptimized: true,
		contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
	},
};

module.exports = nextConfig;
