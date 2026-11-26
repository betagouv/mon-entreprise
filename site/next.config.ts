import { join } from 'node:path'

import type { NextConfig } from 'next'

import { readRouteTree } from './build/readRouteTree'
import {
	pageRoutes,
	routeHrefs,
	translatedRoutes,
} from './build/translatedRoutes'

const ORIGINAL_LANGUAGE = 'fr'

const langue = process.env.LANGUE ?? ORIGINAL_LANGUAGE

const servesOriginalPaths = langue === ORIGINAL_LANGUAGE

const routeTree = readRouteTree(join(__dirname, 'app'))

const routesWithATranslation = translatedRoutes(routeTree)

const rewrites = [
	...(servesOriginalPaths
		? []
		: routesWithATranslation.map(({ original, translated }) => ({
				source: translated,
				destination: original,
			}))),
	{
		source: '/twemoji/:path*',
		destination:
			'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/:path*',
	},
]

const redirects = routesWithATranslation.map(({ original, translated }) => ({
	source: servesOriginalPaths ? translated : original,
	destination: servesOriginalPaths ? original : translated,
	permanent: true,
}))

const nextConfig: NextConfig = {
	compiler: {
		styledComponents: true,
	},

	env: {
		LANGUE: langue,
		ROUTE_HREFS: JSON.stringify(
			routeHrefs(pageRoutes(routeTree), !servesOriginalPaths)
		),
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
