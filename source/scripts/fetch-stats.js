// This script uses the Matomo API which requires an access token
// Once you have your access token you can put it in a `.env` file at the root
// of the project to enable it during development. For instance:
// MATOMO_TOKEN=f4336c82cb1e494752d06e610614eab12b65f1d1
//
require('dotenv').config()
require('isomorphic-fetch')
var d3 = require('d3')
var querystring = require('querystring')
var { createDataDir, writeInDataDir } = require('./utils.js')

// We use the Matomo API.
// Documentation can be found here : https://developer.matomo.org/api-reference/reporting-api

const apiURL = params => {
	const query = querystring.stringify({
		period: 'month',
		date: 'last1',
		method: 'API.get',
		format: 'JSON',
		module: 'API',
		idSite: 39,
		language: 'fr',
		apiAction: 'get',
		token_auth: process.env.MATOMO_TOKEN,
		...params
	})
	return `https://stats.data.gouv.fr/index.php?${query}`
}

// In case we cannot fetch the release (the API is down or the Authorization
// token isn't valid) we fallback to some fake data -- it would be better to
// have a static ressource accessible without authentification.
const fakeData = [
	{
		key: '0',
		values: [
			{ key: '/salarié', value: 0 },
			{ key: '/auto-entrepreneur', value: 0 },
			{ key: '/artiste-auteur', value: 0 },
			{ key: '/indépendant', value: 0 },
			{ key: '/comparaison-régimes-sociaux', value: 0 },
			{ key: '/assimilé-salarié', value: 0 }
		]
	}
]

async function main() {
	createDataDir()
	writeInDataDir('stats.json', await fetchStats())
	writeInDataDir('total_visits.json', await fetchNumberofVisitsbyMonth())
}

async function fetchStats() {
	try {
		const response = await fetch(
			apiURL({
				period: 'day',
				date: 'last365',
				method: 'Actions.getPageUrls',
				search_recursive: 1,
				keep_totals_row: 0,
				idSubtable: 2
			})
		)
		const data = await response.json()
		let result = Object.fromEntries(
			// convert to array, map, and then fromEntries gives back the object
			Object.entries(data).map(([key, value]) => [
				key,
				value
					.filter(function(page) {
						return [
							'/salarié',
							'/auto-entrepreneur',
							'/artiste-auteur',
							'/indépendant',
							'/comparaison-régimes-sociaux',
							'/assimilé-salarié'
						].includes(page.label) // '/salarie' pas pris en compte
					})
					.map(function(page) {
						var { label, nb_visits } = page
						return { month: new Date(key).getMonth(), label, nb_visits }
					})
			])
		)
		result = Object.values(result).reduce(function(prev, curr) {
			return [...prev, ...curr]
		})

		result = d3
			.nest()
			.key(p => p.month)
			.key(p => p.label)
			.rollup(function(v) {
				return d3.sum(v, function(p) {
					return p.nb_visits
				})
			})
			.entries(result)
		return result
	} catch (e) {
		console.log('toto')
		return fakeData
	}
}
const visitsIn2019 = {
	'2019-01': 119541,
	'2019-02': 99065,
	'2019-03': 122931,
	'2019-04': 113454,
	'2019-05': 118637,
	'2019-06': 152981,
	'2019-07': 141079,
	'2019-08': 127326,
	'2019-09': 178474,
	'2019-10': 198260,
	'2019-11': 174515,
	'2019-12': 116305
}
async function fetchNumberofVisitsbyMonth() {
	try {
		const response = await fetch(
			apiURL({
				period: 'month',
				date: 'last12',
				method: 'VisitsSummary.getUniqueVisitors'
			})
		)
		const data = await response.json()
		var result = Object.entries(
			JSON.parse(JSON.stringify({ ...data, ...visitsIn2019 }))
		)
			.sort(([t1], [t2]) => (t1 > t2 ? 1 : -1))
			.map(([x, y]) => ({ year: x, nb_uniq_visitors: y }))

		return result
	} catch (e) {
		console.log('toto')
		return Object.entries(visitsIn2019).map(([a, b]) => {
			return { year: a, nb_uniq_visitors: b }
		})
	}
}

main()
