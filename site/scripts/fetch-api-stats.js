import 'dotenv/config.js'
import 'isomorphic-fetch'

const fetchApiStats = async (page, start, end, interval) => {
	if (!process.env.PLAUSIBLE_API_KEY) {
		throw new Error(
			"Variables d'environnement manquantes : nous ne récupérons pas les statistiques d'usage"
		)
	}

	const url =
		'https://plausible.io/api/v1/stats/timeseries?' +
		Object.entries({
			site_id: 'mon-entreprise.urssaf.fr/api',
			period: 'custom',
			date: start + ',' + end,
			interval,
			metrics: 'pageviews,visitors',
			filters: 'event:page==' + page,
		})
			.map(([k, v]) => encodeURIComponent(k) + '=' + encodeURIComponent(v))
			.join('&')

	const result = await fetch(url, {
		headers: new Headers({
			Authorization: `Bearer ${process.env.PLAUSIBLE_API_KEY}`,
		}),
	})

	return await result.json()
}

export const apiStats = async (start, end, interval) => {
	const names = ['evaluate', 'rules', 'rule']
	const data = Object.values(
		(
			await Promise.all([
				fetchApiStats('/api/v1/evaluate', start, end, interval),
				fetchApiStats('/api/v1/rules', start, end, interval),
				fetchApiStats('/api/v1/rules/*', start, end, interval),
			])
		)
			.filter((x) => !!x)
			.flatMap(({ results }, i) =>
				results.map(({ date, pageviews }) => ({ date, [names[i]]: pageviews }))
			)
			.reduce(
				(acc, el) => (
					acc[el.date]
						? (acc[el.date] = { ...acc[el.date], ...el })
						: (acc[el.date] = el),
					acc
				),
				{}
			)
	)

	return data
}
