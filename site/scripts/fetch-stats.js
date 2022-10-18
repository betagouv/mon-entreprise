import 'dotenv/config.js'
import 'isomorphic-fetch'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { apiStats } from './fetch-api-stats.js'
import { createDataDir, writeInDataDir } from './utils.js'

const matomoSiteVisitsHistory = JSON.parse(
	fs.readFileSync(
		path.join(fileURLToPath(import.meta.url), '..', 'matomoVisitHistory.json')
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
		if (response.status === 429) {
			return new Promise((resolve) =>
				setTimeout(() => resolve(fetchApi(query)), 100)
			)
		}
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

const buildCreerQuery = (period, granularity) => ({
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
					$AND: [
						{
							page: {
								$eq: 'accueil',
							},
						},
						{
							page_chapter1: {
								$eq: 'creer',
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

const buildCreerSegmentQuery = (period, granularity) => ({
	columns: [
		'page',
		'page_chapter1',
		'page_chapter2',
		'page_chapter3',
		'm_visits',
	],
	segment: {
		section: {
			scope: 'visit_id',
			category: 'property',
			coverage: 'at_least_one_visit',
			content: {
				and: [
					{
						condition: {
							filter: {
								page_chapter1: {
									$eq: 'creer',
								},
							},
						},
					},
					{
						condition: {
							filter: {
								page: {
									$eq: 'accueil',
								},
							},
						},
					},
				],
			},
			mode: 'include',
		},
	},
	space: {
		s: [617190],
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
						$eq: 'creer',
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
								$in: ['creer', 'gerer', 'simulateurs'],
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
const uniformiseData = (data) =>
	data
		.map(({ d_evo_day, d_evo_month, m_visits, m_events, ...data }) => ({
			date: d_evo_day != null ? d_evo_day : d_evo_month,
			nombre: m_visits != null ? m_visits : m_events,
			...data,
		}))
		// For some reason, an artifact create ghost page with unlogical chapter metrics...
		// It seems to only by one per month thought... This hacks resolves it
		.filter(({ m_visits }) => m_visits === undefined || m_visits > 2)

const flattenPage = (list) =>
	list
		.filter(
			(p) => p && (p.page_chapter2 !== 'N/A' || p.page_chapter1 === 'creer')
		) // Remove simulateur landing page
		.map(({ Rows, ...page }) => Rows.map((r) => ({ ...page, ...r })))
		.flat()

async function fetchDailyVisits() {
	const pages = uniformiseData([
		...flattenPage(await fetchApi(buildSimulateursQuery(last60days, 'D'))),
		...flattenPage(await fetchApi(buildCreerQuery(last60days, 'D'))),
	])
	const site = uniformiseData(
		(await fetchApi(buildSiteQuery(last60days, 'D')))[0].Rows
	)

	const creer = uniformiseData(
		flattenPage(await fetchApi(buildCreerSegmentQuery(last60days, 'D')))
	)

	const { start, end } = last60days

	return {
		pages,
		site,
		creer,
		api: await apiStats(start, end, 'date'),
	}
}

async function fetchMonthlyVisits() {
	console.log('fetchMonthlyVisits')
	const pages = uniformiseData([
		...flattenPage(await fetchApi(buildSimulateursQuery(last36Months, 'M'))),
		...flattenPage(await fetchApi(buildCreerQuery(last36Months, 'M'))),
	])

	const site = [
		...matomoSiteVisitsHistory.map(({ date, visites }) => ({
			date: date + '-01',
			nombre: visites,
		})),
		...uniformiseData(
			(await fetchApi(buildSiteQuery(last36Months, 'M')))[0].Rows
		),
	]

	const creer = uniformiseData(
		flattenPage(await fetchApi(buildCreerSegmentQuery(last36Months, 'M')))
	)

	const { start, end } = last36Months

	return {
		pages,
		site,
		creer,
		api: await apiStats(start, end, 'month'),
	}
}

const getISODatesStartEndPreviousMonth = () => {
	const dateFirstDayPreviousMonth = new Date()
	// On prend le premier jour du mois dernier
	dateFirstDayPreviousMonth.setMonth(dateFirstDayPreviousMonth.getMonth() - 1) // comment line to test locally
	dateFirstDayPreviousMonth.setDate(1)
	dateFirstDayPreviousMonth.setUTCHours(0, 0, 0, 0)
	const dateLastDayPreviousMonth = new Date(dateFirstDayPreviousMonth)
	// Ici l'index 0 permet de récupérer le dernier jour du mois précédent
	// dateLastDayPreviousMonth.setMonth(dateLastDayPreviousMonth.getMonth() + 1) // uncomment to test locally
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
				'Content-Type': 'application/json',
			},
		}
	)

	const result = await response.json()

	return result?.data
}

async function fetchAllCrispConversations(params) {
	try {
		let isEndPagination = false
		let pageCount = 1
		const dataConversations = []

		while (!isEndPagination) {
			const paginatedData = await fetchPaginatedCrispConversations(
				pageCount,
				params
			)

			// Array vide : plus rien à fetch de plus
			if (paginatedData.length === 0) {
				isEndPagination = true
			}

			dataConversations.push(...paginatedData)
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

	const conversations = await fetchAllCrispConversations(
		`filter_resolved=1&filter_date_start=${startISODatePreviousMonth}&filter_date_end=${endISODatePreviousMonth}`
	)
	return conversations.length
}

async function fetchZammadUserAnswersStats() {
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

async function fetchAllUserAnswerStats() {
	const zammadAnswersCount = await fetchZammadUserAnswersStats()
	const cripsAnswersCount = await fetchCrispAnsweredConversationsLastMonth()

	return zammadAnswersCount + cripsAnswersCount
}

async function fetchGithubIssuesFromTags(tags) {
	const query = `query {
			repository(owner:"betagouv", name:"mon-entreprise") {${tags
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
	const conversationsResolved = await fetchAllCrispConversations(
		'filter_resolved=1&search_query=issue&search_type=segment'
	)

	const sortedSegments = conversationsResolved
		.reduce((acc, conversation) => {
			const newAcc = [...acc]
			const conversationSegments = conversation.meta.segments

			conversationSegments
				.filter((segment) => /#[\d]+/.exec(segment))
				.forEach((segment) => {
					const segmentObjectIndex = newAcc.findIndex(
						(segmentObject) => segmentObject.name === segment
					)
					if (segmentObjectIndex < 0) {
						newAcc.push({ name: segment, count: 1 })
					} else {
						newAcc[segmentObjectIndex].count += 1
					}
				})
			return newAcc
		}, [])
		.sort((t1, t2) => t2.count - t1.count)

	return fetchGithubIssuesFromTags(sortedSegments)
}

async function fetchZammadUserFeedbackIssues() {
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

	return fetchGithubIssuesFromTags(sortedTags)
}

async function fetchAllUserFeedbackIssues() {
	const crispFeedbackIssues = await fetchCrispUserFeedbackIssues()
	const zammadFeedbackIssues = await fetchZammadUserFeedbackIssues()

	const allIssues = [...crispFeedbackIssues]

	zammadFeedbackIssues.forEach((zammadIssue) => {
		const issueIndex = allIssues.findIndex(
			(issue) => issue.number === zammadIssue.number
		)
		if (issueIndex > 0) {
			allIssues[issueIndex].count += zammadIssue.count
		} else {
			allIssues.push(zammadIssue)
		}
	})

	return {
		open: allIssues.filter((s) => !s.closedAt),
		closed: allIssues
			.filter((s) => s.closedAt)
			.sort((i1, i2) => new Date(i2.closedAt) - new Date(i1.closedAt)),
	}
}

async function main() {
	createDataDir()
	// In case we cannot fetch the release (the API is down or the Authorization
	// token isn't valid) we fallback to some fake data -- it would be better to
	// have a static ressource accessible without authentification.
	writeInDataDir('stats.json', {
		retoursUtilisateurs: {
			open: [],
			closed: [],
		},
		nbAnswersLast30days: 0,
	})

	try {
		if (
			!process.env.ATINTERNET_API_ACCESS_KEY ||
			!process.env.ATINTERNET_API_SECRET_KEY ||
			!process.env.ZAMMAD_API_SECRET_KEY
		) {
			console.log(
				"Variables d'environnement manquantes : nous ne récupérons pas les statistiques d'usage"
			)
			return
		}
		const [
			visitesJours,
			visitesMois,
			rawSatisfaction,
			retoursUtilisateurs,
			nbAnswersLast30days,
		] = await Promise.all([
			fetchDailyVisits(),
			fetchMonthlyVisits(),
			fetchApi(buildSatisfactionQuery()),
			fetchAllUserFeedbackIssues(),
			fetchAllUserAnswerStats(),
		])
		const satisfaction = uniformiseData(flattenPage(await rawSatisfaction)).map(
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
			visitesMois,
			satisfaction,
			retoursUtilisateurs,
			nbAnswersLast30days,
		})
	} catch (e) {
		console.error(e)
	}
}
main()
