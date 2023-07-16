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
	images: {
		domains: [
			process.env.NEXT_IMAGE_DOMAIN_1 || '',
			process.env.NEXT_IMAGE_DOMAIN_2 || '',
			process.env.NEXT_MERGE_IMAGE_DOMAIN || '',
		],
		dangerouslyAllowSVG: true,
		contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
	},
};

module.exports = withBundleAnalyzer(nextConfig);
