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
		monthlyVisits: await fetchMonthlyVisits(),
		dailyVisits: await fetchDailyVisits(),
		statusChosen: await fetchStatusChosen(),
		feedback: await fetchFeedback(),
		channelType: await fetchChannelType()
	}
	writeInDataDir('stats.json', stats)
}

function xMonthAgo(x = 0) {
	const date = new Date()
	if (date.getMonth() - x > 0) {
		date.setMonth(date.getMonth() - x)
	} else {
		date.setMonth(12 + date.getMonth() - x)
		date.setFullYear(date.getFullYear() - 1)
	}
	return date.toISOString().substring(0, 7)
}

async function fetchSimulatorsMonth() {
	const getDataFromXMonthAgo = async x => {
		const date = xMonthAgo(x)
		return { date, visites: await fetchSimulators(`${date}-01`) }
	}
	return {
		currentMonth: await getDataFromXMonthAgo(0),
		oneMonthAgo: await getDataFromXMonthAgo(1),
		twoMonthAgo: await getDataFromXMonthAgo(2),
		threeMonthAgo: await getDataFromXMonthAgo(3),
		fourMonthAgo: await getDataFromXMonthAgo(4)
	}
}

async function fetchSimulators(dt) {
	async function fetchSubTableData(data, label) {
		const subTable = data.find(page => page.label === label)
		if (!subTable) {
			console.log('No subtable for ' + label + ' for the period ' + dt + '.')
			return []
		}
		
		const response = await fetch(
			apiURL({
				date: `${dt}`,
				method: 'Actions.getPageUrls',
				search_recursive: 1,
				filter_limits: -1,
				idSubtable: subTable.idsubdatatable
			})
		)
		return await response.json()
	}
	try {
		const response = await fetch(
			apiURL({
				period: 'month',
				date: `${dt}`,
				method: 'Actions.getPageUrls',
				filter_limits: -1
			})
		)
		const firstLevelData = await response.json()

		const coronavirusPage = firstLevelData.find(
			page => page.label === '/coronavirus'
		)

		// Visits on simulators pages
		const dataSimulateurs = await fetchSubTableData(firstLevelData, 'simulateurs')
		const dataGérer = await fetchSubTableData(firstLevelData, 'gérer')
		const dataProfessionLiberale = await fetchSubTableData(dataSimulateurs, 'profession-liberale')

		const resultSimulateurs = [...dataSimulateurs, ...dataProfessionLiberale, ...dataGérer]
			.filter(({ label }) =>
				[
					'/salaire-brut-net',
					'/chômage-partiel',
					'/auto-entrepreneur',
					'/artiste-auteur',
					'/indépendant',
					'/comparaison-régimes-sociaux',
					'/dirigeant-sasu',
					'/aide-declaration-independants',
					'/demande-mobilité',
					'/profession-liberale',
					'/medecin',
					'/auxiliaire-medical',
					'/sage-femme',
					'/chirugien-dentiste',
					'/avocat',
					'/expert-comptable',
					'/économie-collaborative'
				].includes(label)
			)

			/// Two '/salarié' pages are reported on Matomo, one of which has very few
			/// visitors. We delete it manually.
			.filter(
				x =>
					x.label != '/salarié' ||
					x.nb_visits !=
						dataSimulateurs
							.filter(x => x.label == '/salarié')
							.reduce((a, b) => Math.min(a, b.nb_visits), 1000)
			)


		const resultIframes = (await fetchSubTableData(firstLevelData, 'iframes'))
			.filter(x =>
				[
					'/simulateur-embauche',
					'/simulateur-autoentrepreneur',
					'/simulateur-assimilesalarie',
					'/simulateur-artiste-auteur',
					'/simulateur-independant',
					'/demande-mobilite',
					'/profession-liberale',
					'/medecin',
					'/auxiliaire-medical',
					'/sage-femme',
					'/chirugien-dentiste',
					'/avocat',
					'/expert-comptable',
				].some(path => x.label.startsWith(path))
			)

		const groupSimulateursIframesVisits = ({ label }) =>
			label.startsWith('/coronavirus')
				? '/chômage-partiel'
				: label.startsWith('/simulateur-embauche') ||
				  label.startsWith('/salarié')
				? '/salaire-brut-net'
				: label.startsWith('/simulateur-autoentrepreneur')
				? '/auto-entrepreneur'
				: label.startsWith('/assimilé-salarié') ||
				  label.startsWith('/simulateur-assimilesalarie')
				? '/dirigeant-sasu'
				: label.startsWith('/simulateur-independant')
				? '/indépendant'
				: label.startsWith('/simulateur-artiste-auteur')
				? '/artiste-auteur'
				: label.startsWith('/demande-mobilite')
				? '/demande-mobilité'
				: label

		const sumVisits = (acc, { nb_visits }) => acc + nb_visits
		const results = R.reduceBy(
			sumVisits,
			0,
			groupSimulateursIframesVisits,
			[...resultSimulateurs, ...resultIframes, coronavirusPage].filter(Boolean)
		)
		return Object.entries(results)
			.map(([label, nb_visits]) => ({ label, nb_visits }))
			.sort((a, b) => b.nb_visits - a.nb_visits)
	} catch (e) {
		console.error(e)

		console.log('fail to fetch Simulators Visits')
		return null
	}
}

// We had a tracking bug in 2019, in which every click on Safari+iframe counted
// as a visit, so the numbers are manually corrected.
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
			.map(([date, visiteurs]) => ({ date, visiteurs }))
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
		return Object.entries(data).map(([date, visiteurs]) => ({
			date,
			visiteurs
		}))
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
				date: 'last6',
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
		const dates = Object.keys(result).sort((t1, t2) => t1 - t2)
		return {
			currentMonth: { date: dates[0], visites: result[dates[0]] },
			oneMonthAgo: { date: dates[1], visites: result[dates[1]] },
			twoMonthAgo: { date: dates[2], visites: result[dates[2]] },
			threeMonthAgo: { date: dates[3], visites: result[dates[3]] },
			fourMonthAgo: { date: dates[4], visites: result[dates[4]] }
		}
	} catch (e) {
		console.log('fail to fetch channel type')
		return null
	}
}

main()
