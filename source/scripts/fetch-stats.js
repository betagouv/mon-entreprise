// This script uses the Matomo API which requires an access token
// Once you have your access token you can put it in a `.env` file at the root
// of the project to enable it during development. For instance:
//
// MATOMO_TOKEN=f4336c82cb1e494752d06e610614eab12b65f1d1
//
// Matomo API documentation:
// https://developer.matomo.org/api-reference/reporting-api

require('dotenv').config()
require('isomorphic-fetch')
const querystring = require('querystring')
const { createDataDir, writeInDataDir } = require('./utils.js')
const R = require('ramda')

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

async function main() {
	createDataDir()
	const stats = {
		simulators: await fetchSimulatorsMonth(),
		monthly_visits: await fetchMonthlyVisits(),
		daily_visits: await fetchDailyVisits(),
		status_chosen: await fetchStatusChosen(),
		feedback: await fetchFeedback(),
		channel_type: await fetchChannelType()
	}
	writeInDataDir('stats.json', stats)
}
function firstDayXMonthAgo(dt, X = 0) {
	let [year, month] = dt.split('-')
	if (month - X > 0) {
		month -= X
	} else {
		month = 12 + (month - X)
		year -= 1
	}
	const pad = n => (+n < 10 ? `0${n}` : '' + n)
	return {
		date: `${year}-${pad(month)}-01`,
		monthyear: `${pad(month)}-${year}`
	}
}
async function fetchSimulatorsMonth() {
	const today = new Date().toJSON().slice(0, 10)
	const months = {
		currentMonth: {
			date: firstDayXMonthAgo(today, 0).monthyear,
			visites: await fetchSimulators(today)
		},
		oneMonthAgo: {
			date: firstDayXMonthAgo(today, 1).monthyear,
			visites: await fetchSimulators(firstDayXMonthAgo(today, 1).date)
		},
		twoMonthAgo: {
			date: firstDayXMonthAgo(today, 2).monthyear,
			visites: await fetchSimulators(firstDayXMonthAgo(today, 2).date)
		}
	}
	return months
}

async function fetchSimulators(dt) {
	try {
		const response = await fetch(
			apiURL({
				period: 'month',
				date: `${dt}`,
				method: 'Actions.getPageUrls',
				filter_limits: -1
			})
		)
		const data = await response.json()

		// Coronavirus page
		const coronavirus = R.map(
			x => {
				const { label, nb_visits } = x
				return {
					label,
					nb_visits
				}
			},
			data.filter(page => page.label == '/coronavirus')
		)

		// Visits on simulators pages
		const idTableSimulateurs = data.filter(
			page => page.label == 'simulateurs'
		)[0].idsubdatatable

		const responseSimulateurs = await fetch(
			apiURL({
				date: `${dt}`,
				method: 'Actions.getPageUrls',
				search_recursive: 1,
				filter_limits: -1,
				idSubtable: idTableSimulateurs
			})
		)

		const dataSimulateurs = await responseSimulateurs.json()
		const resultSimulateurs = R.map(
			x => {
				const { label, nb_visits } = x
				return {
					label,
					nb_visits
				}
			},
			dataSimulateurs
				.filter(x =>
					[
						'/salarié',
						'/auto-entrepreneur',
						'/artiste-auteur',
						'/indépendant',
						'/comparaison-régimes-sociaux',
						'/assimilé-salarié'
					].includes(x.label)
				)

				.filter(
					x =>
						x.label != '/salarié' ||
						x.nb_visits !=
							dataSimulateurs
								.filter(x => x.label == '/salarié')
								.reduce((a, b) => Math.min(a, b.nb_visits), 1000)
				) /// 2 '/salarié' pages have been uploaded by the API, one of which has very few visitors.  We delete it manually.
		)

		// Add iframes
		const idTableIframes = data.filter(page => page.label == 'iframes')[0]
			.idsubdatatable
		const responseIframes = await fetch(
			apiURL({
				date: `${dt}`,
				method: 'Actions.getPageUrls',
				search_recursive: 1,
				filter_limits: -1,
				idSubtable: idTableIframes
			})
		)
		const dataIframes = await responseIframes.json()
		const resultIframes = R.map(
			x => {
				const { label, nb_visits } = x
				return {
					label,
					nb_visits
				}
			},
			dataIframes.filter(x =>
				[
					'/simulateur-embauche?couleur=',
					'/simulateur-autoentrepreneur?couleur='
				].includes(x.label)
			)
		)
		const groupSimulateursIframesVisits = ({ label }) =>
			label == '/simulateur-embauche?couleur='
				? '/salarié'
				: label == '/simulateur-autoentrepreneur?couleur='
				? '/auto-entrepreneur'
				: label

		const sumVisits = (acc, { nb_visits }) => acc + nb_visits
		const result = R.reduceBy(sumVisits, 0, groupSimulateursIframesVisits, [
			...resultSimulateurs,
			...resultIframes,
			...coronavirus
		])
		const diff = (a, b) => b.nb_visits - a.nb_visits
		return R.sort(
			diff,
			Object.keys(result).map(key => {
				return { label: key, nb_visits: result[key] }
			})
		)
	} catch (e) {
		console.log('fail to fetch Simulators Visits')
		return null
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

async function fetchMonthlyVisits() {
	try {
		const response = await fetch(
			apiURL({
				period: 'month',
				date: 'previous12',
				method: 'VisitsSummary.getUniqueVisitors'
			})
		)
		const data = await response.json()
		const result = Object.entries({ ...data, ...visitsIn2019 })
			.sort(([t1], [t2]) => (t1 > t2 ? 1 : -1))
			.map(([x, y]) => {
				const [year, month] = x.split('-')
				return { date: `${month}/${year}`, visiteurs: y }
			})
		return result
	} catch (e) {
		console.log('fail to fetch Monthly Visits')
		return null
	}
}

async function fetchDailyVisits() {
	try {
		const response = await fetch(
			apiURL({
				period: 'day',
				date: 'previous30',
				method: 'VisitsSummary.getUniqueVisitors'
			})
		)
		const data = await response.json()
		return Object.entries(data).map(([a, b]) => {
			const [year, month, day] = a.split('-')
			return {
				date: `${day}/${month}/${year}`,
				visiteurs: b
			}
		})
	} catch (e) {
		console.log('fail to fetch Daily Visits')
		return null
	}
}

async function fetchStatusChosen() {
	try {
		const response = await fetch(
			apiURL({
				method: 'Events.getAction',
				label: 'status chosen',
				date: 'previous1'
			})
		)
		const data = await response.json()
		const response2 = await fetch(
			apiURL({
				method: 'Events.getNameFromActionId',
				idSubtable: Object.values(data)[0][0].idsubdatatable,
				date: 'previous1'
			})
		)
		const data2 = await response2.json()
		const result = Object.values(data2)[0].map(({ label, nb_visits }) => ({
			label,
			nb_visits
		}))
		return result
	} catch (e) {
		console.log('fail to fetch Status Chosen')
		return null
	}
}

async function fetchFeedback() {
	try {
		const APIcontent = await fetch(
			apiURL({
				method: 'Events.getCategory',
				label: 'Feedback &gt; @rate%20page%20usefulness',
				date: 'previous5'
			})
		)
		const APIsimulator = await fetch(
			apiURL({
				method: 'Events.getCategory',
				label: 'Feedback &gt; @rate%20simulator',
				date: 'previous5'
			})
		)
		const feedbackcontent = await APIcontent.json()
		const feedbacksimulator = await APIsimulator.json()

		let content = 0
		let simulator = 0
		let j = 0
		// The weights are defined by taking the coefficients of an exponential
		// smoothing with alpha=0.8 and normalizing them. The current month is not
		// considered.
		const weights = [0.0015, 0.0076, 0.0381, 0.1905, 0.7623]
		for (const i in feedbackcontent) {
			content += feedbackcontent[i][0].avg_event_value * weights[j]
			simulator += feedbacksimulator[i][0].avg_event_value * weights[j]
			j += 1
		}
		return {
			content: Math.round(content * 10),
			simulator: Math.round(simulator * 10)
		}
	} catch (e) {
		console.log('fail to fetch feedbacks')
		return null
	}
}

async function fetchChannelType() {
	try {
		const response = await fetch(
			apiURL({
				period: 'month',
				date: `last3`,
				method: 'Referrers.getReferrerType'
			})
		)

		const data = await response.json()

		const result = R.map(
			date =>
				date
					.filter(x =>
						['Sites web', 'Moteurs de recherche', 'Entrées directes'].includes(
							x.label
						)
					)
					.map(({ label, nb_visits }) => ({
						label,
						nb_visits
					})),
			data
		)
		dates = Object.keys(result).sort((t1, t2) => t1 - t2)
		return {
			currentMonth: { date: dates[0], visites: result[dates[0]] },
			oneMonthAgo: { date: dates[1], visites: result[dates[1]] },
			twoMonthAgo: { date: dates[2], visites: result[dates[2]] }
		}
	} catch (e) {
		console.log('fail to fetch channel type')
		return null
	}
}

main()
