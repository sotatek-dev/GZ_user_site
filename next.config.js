/** @type {import('next').NextConfig} */
import { join } from 'path';
const nextConfig = {
	reactStrictMode: true,
	swcMinify: true,
	sassOptions: {
		includePaths: [join(__dirname, 'styles')],
	},
	cssModules: true,
	// env: {
	// 	// declare here all your variables
	// 	BASE_URL: process.env.BASE_URL,
	// },
	images: {
		dangerouslyAllowSVG: true,
		unoptimized: true,
		contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
	},
};

export default nextConfig;
