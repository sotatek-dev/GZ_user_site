/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
	reactStrictMode: true,
	sassOptions: {
		includePaths: [path.join(__dirname, 'styles')],
	},
	swcMinify: true,
	cssModules: true,
	images: {
		dangerouslyAllowSVG: true,
		// disableStaticImages: true,
		// unoptimized: true,
		contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
		domains: ['172.16.1.217'],
	},
};

module.exports = nextConfig;
