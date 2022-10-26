/** @type {import('next').NextConfig} */
const path = require('path');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
	enabled: process.env.ANALYZE === 'true',
});

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
		domains: [
			'172.16.1.217',
			'api.galactix.sotatek.works',
			'52.78.146.69',
			'galactix-uat.s3.ap-northeast-2.amazonaws.com',
		],
		dangerouslyAllowSVG: true,
		// disableStaticImages: true,
		// unoptimized: true,
		contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
	},
};

module.exports = withBundleAnalyzer(nextConfig);
