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
							// filter: {
							// 	page_chapter2: {
							// 		$eq: 'guide',
							// 	},
							// },
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
					// $AND: [
					// {
					// 	page: {
					// 		$neq: 'liste',
					// 	},
					// },
					// {
					page_chapter1: {
						$eq: 'creer',
					},
					// },
					// {
					// 	page_chapter2: {
					// 		$eq: 'statut',
					// 	},
					// },
					// ],
				},
			},
		},
	},
	options: {
		ignore_null_properties: true,
	},
})

// 	{
// 	columns: [
// 		'page',
// 		'page_chapter1',
// 		'page_chapter2',
// 		'page_chapter3',
// 		'm_visits',
// 	],
// 	segment: {
// 		section: {
// 			scope: 'visit_id',
// 			category: 'property',
// 			coverage: 'at_least_one_visit',
// 			content: {
// 				and: [
// 					{
// 						condition: {
// 							filter: {
// 								page_chapter1: {
// 									$eq: 'creer',
// 								},
// 							},
// 						},
// 					},
// 					{
// 						condition: {
// 							filter: {
// 								page_chapter2: {
// 									$eq: 'guide',
// 								},
// 							},
// 						},
// 					},
// 				],
// 			},
// 			mode: 'include',
// 		},
// 	},
// 	space: {
// 		s: [617190],
// 	},
// 	period: {
// 		p1: [period],
// 	},
// 	evo: {
// 		granularity,
// 		top: {
// 			'page-num': 1,
// 			'max-results': 500,
// 			sort: ['-m_visits'],
// 			filter: {
// 				property: {
// 					page_chapter1: {
// 						$eq: 'creer',
// 					},
// 				},
// 			},
// 		},
// 	},
// 	options: {
// 		ignore_null_properties: true,
// 	},
// }

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

const flattenPage = (list) => {
	// console.log('=>', JSON.stringify(list, null, 2))
	return list
		.filter(
			(p) => p && (p.page_chapter2 !== 'N/A' || p.page_chapter1 === 'creer')
		) // Remove simulateur landing page
		.map(({ Rows, ...page }) => Rows.map((r) => ({ ...page, ...r })))
		.flat()
}

async function fetchDailyVisits() {
	const pages = uniformiseData([
		...flattenPage(await fetchApi(buildSimulateursQuery(last60days, 'D'))),
		...flattenPage(await fetchApi(buildCreerQuery(last60days, 'D'))),
	])
	const site = uniformiseData(
		(await fetchApi(buildSiteQuery(last60days, 'D')))[0].Rows
	)

	const { start, end } = last60days

	return {
		pages,
		site,
		creer: uniformiseData([
			// ...flattenPage(await fetchApi(buildSimulateursQuery(last60days, 'D'))),
			...flattenPage(await fetchApi(buildCreerSegmentQuery(last60days, 'D'))),
		]),
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

	const { start, end } = last36Months

	return {
		pages,
		site,
		creer: uniformiseData([
			// ...flattenPage(await fetchApi(buildSimulateursQuery(last36Months, 'M'))),
			...flattenPage(await fetchApi(buildCreerSegmentQuery(last36Months, 'M'))),
		]),
		api: await apiStats(start, end, 'month'),
	}
}

// https://api.atinternet.io/v3/data/getData?param=%7B%22columns%22:%5B%22page%22,%22page_chapter1%22,%22page_chapter2%22,%22page_chapter3%22,%22m_unique_visitors%22%5D,%22sort%22:%5B%22-m_unique_visitors%22%5D,%22filter%22:%7B%22property%22:%7B%22$AND%22:%5B%7B%22page%22:%7B%22$neq%22:%22liste%22%7D%7D,%7B%22page_chapter1%22:%7B%22$eq%22:%22creer%22%7D%7D,%7B%22page_chapter2%22:%7B%22$eq%22:%22statut%22%7D%7D%5D%7D%7D,%22segment%22:%7B%22section%22:%7B%22scope%22:%22visit_id%22,%22category%22:%22property%22,%22coverage%22:%22at_least_one_visit%22,%22content%22:%7B%22and%22:%5B%7B%22condition%22:%7B%22filter%22:%7B%22page_chapter1%22:%7B%22$eq%22:%22creer%22%7D%7D%7D%7D,%7B%22condition%22:%7B%22filter%22:%7B%22page_chapter2%22:%7B%22$eq%22:%22guide%22%7D%7D%7D%7D%5D%7D,%22mode%22:%22include%22%7D%7D,%22space%22:%7B%22s%22:%5B617190%5D%7D,%22period%22:%7B%22p1%22:%5B%7B%22type%22:%22D%22,%22start%22:%222020-01-01%22,%22end%22:%222022-10-11%22%7D%5D%7D,%22max-results%22:50,%22page-num%22:1,%22options%22:%7B%22ignore_null_properties%22:true,%22eco_mode%22:true%7D%7D

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

	return {
		open: issues.filter((s) => !s.closedAt),
		closed: issues
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
			fetchUserFeedbackIssues(),
			fetchUserAnswersStats(),
		])
		console.log('rawSatisfaction')
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
