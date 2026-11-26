const langue = process.env.LANGUE ?? 'fr'

const servesFrench = langue === 'fr'

const localizedRoots = {
	fr: ['/simulateurs'],
	en: ['/calculators'],
}

const otherSiteUrl = servesFrench
	? process.env.NEXT_PUBLIC_EN_BASE_URL
	: process.env.NEXT_PUBLIC_FR_BASE_URL

const otherSiteRoots = servesFrench ? localizedRoots.en : localizedRoots.fr

const redirects = otherSiteUrl
	? otherSiteRoots.flatMap((root) => [
			{ source: root, destination: otherSiteUrl, permanent: true },
			{
				source: `${root}/:path*`,
				destination: otherSiteUrl,
				permanent: true,
			},
		])
	: []

/** @type {import('next').NextConfig} */
const nextConfig = {
	compiler: {
		styledComponents: true,
	},

	env: {
		LANGUE: langue,
	},

	transpilePackages: [
		'modele-social',
		'modele-as',
		'modele-ti',
		'exoneration-covid',
		'publicodes',
		'@publicodes/react-ui',
	],

	experimental: {
		turbopackScopeHoisting: false,
	},

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

	async redirects() {
		return redirects
	},
}

export default nextConfig
