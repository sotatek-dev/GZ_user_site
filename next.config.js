/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
	reactStrictMode: true,
	sassOptions: {
		includePaths: [path.join(__dirname, 'styles')],
	},
	cssModules: true,
	images: {
		dangerouslyAllowSVG: true,
		// disableStaticImages: true,
		// unoptimized: true,
		contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
	},
};

module.exports = nextConfig;
