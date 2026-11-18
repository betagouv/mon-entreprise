import { join } from 'node:path'

import type { NextConfig } from 'next'

import { readRouteTree } from './build/readRouteTree'
import { translatedPaths } from './build/translatedPaths'

const langue = process.env.LANGUE ?? 'fr'

const translatedRoutes = translatedPaths(readRouteTree(join(__dirname, 'app')))

const rewrites = [
	...(langue === 'fr'
		? []
		: translatedRoutes.map(({ fr, en }) => ({ source: en, destination: fr }))),
	{
		source: '/twemoji/:path*',
		destination:
			'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/:path*',
	},
]

const redirects = translatedRoutes.map(({ fr, en }) => ({
	source: langue === 'fr' ? en : fr,
	destination: langue === 'fr' ? fr : en,
	permanent: true,
}))

const nextConfig: NextConfig = {
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

	rewrites: () => Promise.resolve(rewrites),

	redirects: () => Promise.resolve(redirects),
}

export default nextConfig
