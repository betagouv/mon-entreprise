import dotenv from 'dotenv'
import 'isomorphic-fetch'
import fs from 'fs'
import path from 'path'
import { filter, flatten, map, partition, pipe } from 'ramda'
import { compose } from 'redux'
import { createDataDir, writeInDataDir } from './utils.js'

dotenv.config()

const matomoSiteVisitsHistory = JSON.parse(
	fs.readFileSync(
		path.join(
			import.meta.url.replace('file:', ''),
			'../matomoVisitHistory.json'
		)
	)
)

const fetchApi = async function (query) {
	const response = await fetch('https://api.atinternet.io/v3/data/getData', {
		method: 'POST',
		headers: new Headers({
			'x-api-key': `${process.env.ATINTERNET_API_ACCESS_KEY}_${process.env.ATINTERNET_API_SECRET_KEY}`,
			'Content-Type': 'application/json',
		}),
		body: JSON.stringify(query),
	})
	if (!response.ok) {
		const text = await response.text()
		throw new Error(`Erreur de l'API (${text})`)
	}
	const data = await response.json()
	return data.DataFeed.Rows.map((x) => x.Rows)
}

const buildSimulateursQuery = (period, granularity) => ({
	columns: [
		'page',
		'page_chapter1',
		'page_chapter2',
		'page_chapter3',
		'm_visits',
	],
	space: {
		s: [617190, 617189],
	},
	period: {
		p1: [period],
	},
	evo: {
		granularity,
		top: {
			'page-num': 1,
			'max-results': 500,
			sort: ['-m_visits'],
			filter: {
				property: {
					page_chapter1: {
						$in: ['gerer', 'simulateurs'],
					},
				},
			},
		},
	},
	options: {
		ignore_null_properties: true,
	},
})

const buildSatisfactionQuery = () => ({
	columns: [
		'page_chapter1',
		'page_chapter2',
		'page_chapter3',
		'click',
		'm_events',
	],
	space: {
		s: [617190, 617189],
	},
	period: {
		p1: [last36Months],
	},
	evo: {
		granularity: 'M',
		top: {
			'page-num': 1,
			'max-results': 500,
			sort: ['-m_events'],
			filter: {
				property: {
					$AND: [
						{
							page_chapter1: {
								$in: ['gerer', 'simulateurs'],
							},
						},
						{
							click_chapter1: {
								$eq: 'satisfaction',
							},
						},
					],
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
		s: [617190, 617189],
	},
	period: {
		p1: [period],
	},
	evo: {
		granularity,
		top: {
			'page-num': 1,
			'max-results': 500,
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
			new Date('2021-02-27')
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
				new Date('2021-03')
			)
		)
			.toISOString()
			.slice(0, 8) + '01',
	end: yesterday,
}
const uniformiseData = pipe(
	// For some reason, an artifact create ghost page with unlogical chapter metrics...
	// It seems to only by one per month thought... This hacks resolves it
	filter(({ m_visits }) => m_visits === undefined || m_visits > 2),
	map(({ d_evo_day, d_evo_month, m_visits, m_events, ...data }) => ({
		date: d_evo_day != null ? d_evo_day : d_evo_month,
		nombre: m_visits != null ? m_visits : m_events,
		...data,
	}))
)
const flattenPage = compose(
	flatten,
	map(({ Rows, ...page }) => Rows.map((r) => ({ ...page, ...r }))),
	filter((p) => p.page_chapter2 !== 'N/A') // Remove simulateur landing page
)
async function fetchDailyVisits() {
	const pages = uniformiseData(
		flattenPage(await fetchApi(buildSimulateursQuery(last60days, 'D')))
	)
	const site = uniformiseData(
		(await fetchApi(buildSiteQuery(last60days, 'D')))[0].Rows
	)

	return { pages, site }
}

async function fetchMonthlyVisits() {
	const pages = uniformiseData(
		flattenPage(await fetchApi(buildSimulateursQuery(last36Months, 'M')))
	)

	const site = [
		...matomoSiteVisitsHistory.map(({ date, visites }) => ({
			date: date + '-01',
			nombre: visites,
		})),
		...uniformiseData(
			(await fetchApi(buildSiteQuery(last36Months, 'M')))[0].Rows
		),
	]

	return { pages, site }
}

async function fetchUserAnswersStats() {
	const ticketLists = await fetch(
		'https://mon-entreprise.zammad.com/api/v1/ticket_overviews?view=tickets_repondus_le_mois_dernier',
		{
			headers: new Headers({
				Authorization: `Token token=${process.env.ZAMMAD_API_SECRET_KEY}`,
			}),
		}
	)
	const answer = await ticketLists.json()
	return answer.index.count
}

async function fetchUserFeedbackIssues() {
	const tags = await fetch(
		'https://mon-entreprise.zammad.com/api/v1/tag_list',
		{
			headers: new Headers({
				Authorization: `Token token=${process.env.ZAMMAD_API_SECRET_KEY}`,
			}),
		}
	).then((r) => r.json())
	const sortedTags = tags
		.sort((t1, t2) => t2.count - t1.count)
		.filter(({ name }) => /#[\d]+/.exec(name))
	const query = `query {
			repository(owner:"betagouv", name:"mon-entreprise") {${sortedTags
				.map(
					({ name, count }, i) =>
						`
				issue${i}_${count}: issue(number: ${name.slice(1)}) {
						title
						closedAt
						number
				}`
				)
				.join('\n')}
			}
		}`
	const response = await fetch('https://api.github.com/graphql', {
		method: 'post',
		headers: new Headers({
			Authorization: `bearer ${process.env.GITHUB_API_SECRET}`,
		}),
		body: JSON.stringify({
			query,
		}),
	})
	const data = await response.json()
	const issues = Object.entries(data.data.repository)
		.filter(([, value]) => !!value)
		.map(([k, value]) => ({ ...value, count: +/[\d]+$/.exec(k)[0] }))
	const [closed, open] = partition((s) => s.closedAt, issues)
	return {
		open,
		closed: closed.sort(
			(i1, i2) => new Date(i2.closedAt) - new Date(i1.closedAt)
		),
	}
}
async function main() {
	createDataDir()
	try {
		const visitesJours = await fetchDailyVisits()
		const visitesMois = await fetchMonthlyVisits()
		const satisfaction = uniformiseData(
			flattenPage(await fetchApi(buildSatisfactionQuery()))
		).map((page) => {
			// eslint-disable-next-line no-unused-vars
			const { date, ...satisfactionPage } = {
				month: new Date(new Date(page.date).setDate(1)),
				...page,
			}
			return satisfactionPage
		})
		const retoursUtilisateurs = await fetchUserFeedbackIssues()
		const nbAnswersLast30days = await fetchUserAnswersStats()
		writeInDataDir('stats.json', {
			visitesJours,
			visitesMois,
			satisfaction,
			retoursUtilisateurs,
			nbAnswersLast30days,
		})
	} catch (e) {
		console.error(e)

		// In case we cannot fetch the release (the API is down or the Authorization
		// token isn't valid) we fallback to some fake data -- it would be better to
		// have a static ressource accessible without authentification.
		writeInDataDir('stats.json', {
			visitesJours: [],
			visitesMois: [],
			satisfaction: [],
			retoursUtilisateurs: [],
			nbAnswersLast30days: 0,
		})
	}
}
main().catch((e) => {
	throw new Error(e)
})
