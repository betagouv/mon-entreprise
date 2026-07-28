/** @type {import('next').NextConfig} */
const nextConfig = {
	compiler: {
		styledComponents: true,
	},

	env: {
		LANGUE: process.env.LANGUE ?? 'fr',
	},

	transpilePackages: [
		'modele-social',
		'modele-as',
		'modele-ti',
		'exoneration-covid',
		'publicodes',
		'@publicodes/react-ui',
	],

	turbopack: {
		rules: {
			'*.yaml': {
				loaders: ['yaml-loader'],
				as: '*.js',
			},
		},
	},

	async rewrites() {
		return [
			{
				source: '/twemoji/:path*',
				destination:
					'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/:path*',
			},
		]
	},
}

export default nextConfig
