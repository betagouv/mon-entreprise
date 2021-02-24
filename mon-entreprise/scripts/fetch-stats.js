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

const { createDataDir, writeInDataDir } = require('./utils.js')
const fetchApi = (query) =>
	fetch('https://api.atinternet.io/v3/beta/cdf/data/getData', {
		method: 'POST',
		headers: new Headers({
			'x-api-key': `${process.env.ATINTERNET_API_ACCESS_KEY}_${process.env.ATINTERNET_API_SECRET_KEY}`,
			'Content-Type': 'application/json',
		}),
		body: JSON.stringify(query),
	})

const buildSimulateursQuery = (period, granularity) => ({
	columns: ['page', 'page_chapter2', 'page_chapter3', 'm_visits'],
	space: {
		s: [617189],
	},
	period: {
		p1: [period],
	},
	evo: {
		granularity,
		top: {
			'page-num': 1,
			'max-results': 20,
			sort: ['-m_visits'],
			filter: {
				property: {
					page_chapter1: {
						$eq: 'simulateurs',
					},
				},
			},
		},
	},
	options: {
		ignore_null_properties: true,
	},
})

const buildSiteQuery = (period, granularity) => ({
	columns: ['m_visits'],
	space: {
		s: [617189],
	},
	period: {
		p1: [period],
	},
	evo: {
		granularity,
		top: {
			'page-num': 1,
			'max-results': 20,
			sort: ['-m_visits'],
		},
	},
	options: {
		ignore_null_properties: true,
	},
})

const yesterday = new Date(new Date().setDate(new Date().getDate() - 1))
	.toISOString()
	.slice(0, 10)
const last60days = {
	type: 'D',
	start: new Date(
		Math.max(
			new Date().setDate(new Date().getDate() - 60),
			new Date('2021-02-20')
		)
	)
		.toISOString()
		.slice(0, 10),
	end: yesterday,
}

const last36Months = {
	type: 'D',
	start:
		new Date(
			Math.max(
				new Date().setMonth(new Date().getMonth() - 36),
				new Date('2021-02')
			)
		)
			.toISOString()
			.slice(0, 8) + '01',
	end: yesterday,
}

async function fetchDailyVisits() {
	const dailyVisits = await Promise.all([
		fetchApi(buildSimulateursQuery(last60days, 'D')).then((r) => r.json()),
		fetchApi(buildSiteQuery(last60days, 'D')).then((r) => r.json()),
	])
	writeInDataDir('visites-jour.json', dailyVisits)
}

async function fetchMonthlyVisits() {
	const monthlyVisits = await Promise.all([
		fetchApi(buildSimulateursQuery(last36Months, 'M')).then((r) => r.json()),
		fetchApi(buildSiteQuery(last36Months, 'M')).then((r) => r.json()),
	])
	writeInDataDir('visites-mois.json', monthlyVisits)
}

async function main() {
	createDataDir()
	await fetchDailyVisits()
	await fetchMonthlyVisits()
}

main()
