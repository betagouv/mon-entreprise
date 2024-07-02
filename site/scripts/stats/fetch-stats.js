import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

import dotenv from 'dotenv'

import { createDataDir, readInDataDir, writeInDataDir } from '../utils.js'

dotenv.config()

const matomoSiteVisitsHistory = JSON.parse(
	fs.readFileSync(
		path.join(fileURLToPath(import.meta.url), '..', 'matomoVisitHistory.json')
	)
)

const fetchApi = async function (query, page = 1) {
	const response = await fetch('https://api.atinternet.io/v3/data/getData', {
		method: 'POST',
		headers: new Headers({
			'x-api-key': `${process.env.ATINTERNET_API_ACCESS_KEY}_${process.env.ATINTERNET_API_SECRET_KEY}`,
			'Content-Type': 'application/json',
		}),
		body: JSON.stringify(query(page)),
	})

	if (!response.ok) {
		if (response.status === 429) {
			return new Promise((resolve) =>
				setTimeout(() => resolve(fetchApi(query, page)), 100)
			)
		}
		const text = await response.text()
		throw new Error(`Erreur de l'API (${text})`)
	}

	const data = await response.json()

	const mergedRows = data.DataFeed.Rows.map((x) => x.Rows)

	if (mergedRows.length >= 100) {
		mergedRows.push(...(await fetchApi(query, page + 1)))
	}

	return mergedRows
}

const buildSimulateursQuery =
	(period, granularity) =>
	(page = 1) => ({
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
				'page-num': page,
				'max-results': 100,
				sort: ['-m_visits'],
				filter: {
					property: {
						page_chapter1: {
							$in: ['assistant', 'simulateurs', 'gerer'],
						},
					},
				},
			},
		},
		options: {
			ignore_null_properties: true,
		},
	})

const buildSatisfactionQuery = (page = 1) => ({
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
		p1: [last12Months],
	},
	evo: {
		granularity: 'M',
		top: {
			'page-num': page,
			'max-results': 100,
			sort: ['-m_events'],
			filter: {
				property: {
					$AND: [
						{
							page_chapter1: {
								$in: ['assistant', 'gerer', 'simulateurs'],
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

const buildSiteQuery =
	(period, granularity) =>
	(page = 1) => ({
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
				'page-num': page,
				'max-results': 100,
				sort: ['-m_visits'],
			},
		},
		options: {
			ignore_null_properties: true,
		},
	})

const buildAPIQuery =
	(period, granularity) =>
	(page = 1) => ({
		columns: ['page', 'm_page_loads'],
		space: {
			s: [617190, 617189],
		},
		period: {
			p1: [period],
		},
		evo: {
			granularity,
			top: {
				'page-num': page,
				'max-results': 100,
				sort: ['-m_page_loads'],
				filter: {
					property: {
						$AND: [
							{
								page_chapter1: {
									$eq: 'api',
								},
							},
							{
								page: {
									$eq: 'evaluate',
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

const last12Months = {
	type: 'D',
	start:
		new Date(
			Math.max(
				new Date().setMonth(new Date().getMonth() - 12),
				new Date('2021-03')
			)
		)
			.toISOString()
			.slice(0, 8) + '01',
	end: yesterday,
}

const uniformiseData = (data) =>
	data
		.map(
			({
				d_evo_day,
				d_evo_month,
				m_visits,
				m_events,
				m_page_loads,
				...data
			}) => ({
				date: d_evo_day != null ? d_evo_day : d_evo_month,
				nombre:
					m_visits != null
						? m_visits
						: m_page_loads != null
						? m_page_loads
						: m_events,
				...data,
			})
		)
		// For some reason, an artifact create ghost page with unlogical chapter metrics...
		// It seems to only by one per month thought... This hacks resolves it
		.filter(({ m_visits }) => m_visits === undefined || m_visits > 2)

const flattenPage = (list) =>
	list
		.filter((p) => p && p.page_chapter2 !== 'N/A') // Remove landing pages
		.map(({ Rows, ...page }) => Rows.map((r) => ({ ...page, ...r })))
		.flat()

async function fetchDailyVisits() {
	const pages = uniformiseData(
		flattenPage(await fetchApi(buildSimulateursQuery(last60days, 'D')))
	)
	const site = uniformiseData(
		(await fetchApi(buildSiteQuery(last60days, 'D')))[0].Rows
	)
	const api = uniformiseData(
		(await fetchApi(buildAPIQuery(last60days, 'D')))[0].Rows
	)

	return {
		pages,
		site,
		api,
	}
}

async function fetchMonthlyVisits() {
	const pages = uniformiseData(
		flattenPage(await fetchApi(buildSimulateursQuery(last12Months, 'M')))
	)

	const site = [
		...matomoSiteVisitsHistory.map(({ date, visites }) => ({
			date: date + '-01',
			nombre: visites,
		})),
		...uniformiseData(
			(await fetchApi(buildSiteQuery(last12Months, 'M')))[0].Rows
		),
	]
	const api = uniformiseData(
		(await fetchApi(buildAPIQuery(last12Months, 'M')))[0].Rows
	)

	return {
		pages,
		site,
		api,
	}
}

const getISODatesStartEndPreviousMonth = () => {
	const dateFirstDayPreviousMonth = new Date()
	// On prend le premier jour du mois dernier
	dateFirstDayPreviousMonth.setMonth(dateFirstDayPreviousMonth.getMonth() - 1)
	dateFirstDayPreviousMonth.setDate(1)
	dateFirstDayPreviousMonth.setUTCHours(0, 0, 0, 0)
	const dateLastDayPreviousMonth = new Date(dateFirstDayPreviousMonth)
	// Ici l'index 0 permet de récupérer le dernier jour du mois précédent
	dateLastDayPreviousMonth.setDate(0)
	dateLastDayPreviousMonth.setUTCHours(23, 59, 59, 999)

	return {
		startISODatePreviousMonth: dateFirstDayPreviousMonth.toISOString(),
		endISODatePreviousMonth: dateLastDayPreviousMonth.toISOString(),
	}
}
async function fetchPaginatedCrispConversations(pageNumber, urlParams) {
	const response = await fetch(
		`https://api.crisp.chat/v1/website/d8247abb-cac5-4db6-acb2-cea0c00d8524/conversations/${pageNumber}${
			urlParams ? `?${urlParams}` : ''
		}`,
		{
			method: 'get',
			headers: {
				Authorization: `Basic ${btoa(
					`${process.env.CRISP_API_IDENTIFIER}:${process.env.CRISP_API_KEY}`
				)}`,
				'X-Crisp-Tier': 'plugin',
			},
		}
	)

	const result = await response.json()

	return result?.data
}

async function fetchAllCrispConversations({ urlParams }) {
	try {
		let isEndPagination = false
		let pageCount = 1
		const dataConversations = []

		while (!isEndPagination) {
			const paginatedData = await fetchPaginatedCrispConversations(
				pageCount,
				urlParams
			)
			// Array vide : plus rien à fetch de plus
			if (paginatedData.length === 0) {
				isEndPagination = true
			}

			if (paginatedData.message) {
				console.error('Crisp error : ' + JSON.stringify(paginatedData))
			}

			dataConversations.push(...(paginatedData || []))
			pageCount++
		}

		return dataConversations
	} catch (e) {
		console.log('error', e)
	}
}

async function fetchCrispAnsweredConversationsLastMonth() {
	const { startISODatePreviousMonth, endISODatePreviousMonth } =
		getISODatesStartEndPreviousMonth()

	const conversations = await fetchAllCrispConversations({
		urlParams: `filter_resolved=1&filter_date_start=${startISODatePreviousMonth}&filter_date_end=${endISODatePreviousMonth}`,
	})
	return conversations?.length ?? 0
}

// eslint-disable-next-line no-unused-vars
async function fetchAllUserAnswerStats() {
	return await fetchCrispAnsweredConversationsLastMonth()
}

async function fetchGithubIssuesFromTags(tags) {
	if (!tags || tags?.length === 0) {
		console.error(`❌ Error: no tags to fetch issues from`)
		return []
	}

	const query = `query {
			repository(owner:"betagouv", name:"mon-entreprise") {${tags
				.map(
					({ name, count }, i) =>
						`
				issue${i}_${count}: issue(number: ${name.slice(1)}) {
						title
						closedAt
						number
						stateReason
						timelineItems(last: 1, itemTypes: [CONVERTED_TO_DISCUSSION_EVENT]) {
							nodes
						}
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

	if (response.status != 200) {
		console.error(
			`❌ Github response status: ${response.status}\n` +
				'\tCheck your GITHUB_API_SECRET key in site/.env\n'
		)
	}

	const data = await response.json()
	const issues = Object.entries(data.data.repository)
		.filter(([, value]) => !!value)
		.map(([k, value]) => ({ ...value, count: +/[\d]+$/.exec(k)[0] }))

	return issues
}

async function fetchCrispUserFeedbackIssues() {
	const conversation = await fetchAllCrispConversations({
		urlParams: 'search_query=issue&search_type=segment',
	})
	const issueCount = conversation?.reduce((acc, conversation) => {
		conversation.meta.segments

			.filter((segment) => /#[\d]+/.exec(segment))
			.forEach((issue) => {
				acc[issue] ??= 0
				acc[issue] += 1
			})
		return acc
	}, {})

	return issueCount
}

// eslint-disable-next-line no-unused-vars
async function fetchAllUserFeedbackIssues() {
	const crispFeedbackIssues = await fetchCrispUserFeedbackIssues()

	const allIssues = crispFeedbackIssues
		.flatMap((issues) => Object.entries(issues))
		.reduce(
			(acc, [issue, count]) => ({
				...acc,
				[issue]: (acc[issue] ?? 0) + count,
			}),
			{}
		)

	const sortedIssues = await fetchGithubIssuesFromTags(
		Object.entries(allIssues)
			.sort(([, a], [, b]) => b - a)
			.map(([name, count]) => ({ name, count }))
	)
	return {
		open: sortedIssues.filter((s) => !s.closedAt),
		closed: sortedIssues
			.filter((s) => s.closedAt)
			.filter((s) => s.stateReason !== 'NOT_PLANNED')
			.filter((s) => s.timelineItems.nodes.length === 0) // Not converted to discussion
			.sort((i1, i2) => new Date(i2.closedAt) - new Date(i1.closedAt)),
	}
}

const mergePreviousData = (previousDatas, newDatas) => {
	if (!Array.isArray(previousDatas) || !Array.isArray(newDatas)) {
		throw new Error('Datas must be arrays')
	}

	const oneYearAgo = new Date(
		new Date().setFullYear(new Date().getFullYear() - 1)
	)

	const mergedDatas = [
		...previousDatas.filter(({ date, month }) => {
			return new Date(date ?? month) <= oneYearAgo
		}),
		...newDatas.filter(({ date, month }) => {
			return new Date(date ?? month) > oneYearAgo
		}),
	].sort((a, b) => new Date(a.date ?? a.month) - new Date(b.date ?? b.month))

	return mergedDatas
}

createDataDir()
const baseData = readInDataDir('base-stats.json')

// In case we cannot fetch the release (the API is down or the Authorization
// token isn't valid) we fallback to some fake data -- it would be better to
// have a static ressource accessible without authentification.
writeInDataDir('stats.json', baseData)

if (
	!process.env.ATINTERNET_API_ACCESS_KEY ||
	!process.env.ATINTERNET_API_SECRET_KEY ||
	!process.env.CRISP_API_IDENTIFIER ||
	!process.env.CRISP_API_KEY ||
	!process.env.GITHUB_API_SECRET
) {
	const missingEnvVar = (name) => (!process.env[name] ? name : null)
	const error = new Error(
		`Variables d'environnement manquantes : ${[
			missingEnvVar('ATINTERNET_API_ACCESS_KEY'),
			missingEnvVar('ATINTERNET_API_SECRET_KEY'),
			missingEnvVar('CRISP_API_IDENTIFIER'),
			missingEnvVar('CRISP_API_KEY'),
			missingEnvVar('GITHUB_API_SECRET'),
		]
			.filter(Boolean)
			.join(', ')}, nous ne récupérons pas les statistiques d'usage`
	)

	console.error(error)
} else {
	const [
		visitesJours,
		visitesMois,
		rawSatisfaction,
		// retoursUtilisateurs,
		// nbAnswersLast30days,
	] = await Promise.all([
		fetchDailyVisits(),
		fetchMonthlyVisits(),
		fetchApi(buildSatisfactionQuery),
		// fetchAllUserFeedbackIssues(),
		// fetchAllUserAnswerStats(),
	])
	const satisfaction = uniformiseData(flattenPage(rawSatisfaction)).map(
		(page) => {
			// eslint-disable-next-line no-unused-vars
			const { date, ...satisfactionPage } = {
				month: new Date(new Date(page.date).setDate(1)),
				...page,
			}
			return satisfactionPage
		}
	)
	writeInDataDir('stats.json', {
		visitesJours,
		visitesMois: Object.fromEntries(
			Object.entries(baseData.visitesMois).map(([key, prev]) => [
				key,
				mergePreviousData(prev, visitesMois[key]),
			])
		),
		satisfaction: mergePreviousData(baseData.satisfaction, satisfaction),
		// We use old data because we don't have account on Zammad and Crisp anymore
		retoursUtilisateurs: baseData.retoursUtilisateurs,
		nbAnswersLast30days: baseData.nbAnswersLast30days,
	})
}
