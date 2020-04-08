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
		period: 'day',
		date: 'last365',
		method: 'Actions.getPageUrls',
		format: 'JSON',
		...params,
		search_recursive: 1,
		keep_totals_row: 0,
		idSubtable: 2,
		module: 'API',
		idSite: 39,
		language: 'fr',
		apiAction: 'get',
		token_auth: process.env.MATOMO_TOKEN
	})
	return `https://stats.data.gouv.fr/index.php?${query}`
}

//console.log(apiURL())

// In case we cannot fetch the release (the API is down or the Authorization
// token isn't valid) we fallback to some fake data -- it would be better to
// have a static ressource accessible without authentification.
const fakeData = [
	{
		'0': {
			'/salarié': 0,
			'/auto-entrepreneur': 0,
			'/indépendant': 0,
			'/comparaison-régimes-sociaux': 0,
			'/assimilé-salarié': 0,
			'/salarie': 0,
			'/artiste-auteur': 0
		}
	}
]

async function main() {
	createDataDir()
	writeInDataDir('stats.json', await fetchStats())
}

async function fetchStats() {
	try {
		const response = await fetch(apiURL())
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
			.key(function(p) {
				return p.month
			})
			.key(function(p) {
				return p.label
			})
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

main()
