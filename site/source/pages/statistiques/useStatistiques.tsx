import { useMemo } from 'react'

import { groupBy } from '@/utils'

import {
	Filter,
	PageChapter2,
	Pageish,
	QuestionRépondues,
	Satisfaction,
	SatisfactionLevel,
	StatsStruct,
	Visites,
} from './types'

export function useStatistiques(stats: StatsStruct, filter: Filter | '') {
	const visitesJours = useMemo(() => {
		return computeVisits(stats.visitesJours, filter)
	}, [filter])

	const visitesMois = useMemo(() => {
		return computeVisits(stats.visitesMois, filter)
	}, [filter])

	const repartition = useMemo(() => {
		const rawData = stats.visitesMois

		return groupByDate(rawData.pages as Pageish[])
	}, [])

	const satisfaction = useMemo(() => {
		if (filter === 'api-rest') {
			return []
		}

		return addSatisfactionScore(
			filterPage(stats.satisfaction as Pageish[], filter) as Satisfaction
		)
	}, [filter])

	const questionsRépondues = useMemo(() => {
		return computeQuestionRépondues(satisfaction, visitesMois)
	}, [satisfaction, visitesMois])

	return {
		visitesJours,
		visitesMois,
		repartition,
		satisfaction,
		questionsRépondues,
	}
}

function computeVisits(
	rawData: StatsStruct['visitesJours'],
	filter: Filter | ''
) {
	let apiRestVisits: Visites = []
	let statsChoixStatut: Visites = []

	if (filter === 'api-rest' || filter === '') {
		// API rest : we consider that every calls are
		apiRestVisits = rawData.api.map((d) => ({
			date: d.date,
			nombre: {
				accueil: d.nombre,
				simulation_commencee: d.nombre,
			},
		}))
	}

	if (filterIs(PageChapter2.ChoixDuStatut, filter) || filter === '') {
		const pages = rawData.pages as Pageish[]
		statsChoixStatut = computeStatsChoixStatut(pages)
	}

	if (filter === 'api-rest') {
		return apiRestVisits
	}

	if (filterIs(PageChapter2.ChoixDuStatut, filter)) {
		return statsChoixStatut
	}
	const visites = filterPage(rawData.pages as Pageish[], filter).map((p) => ({
		date: p.date,
		nombre: {
			accueil: p.nombre.accueil,
			simulation_commencee:
				// In the case of Recherche APE, we need to post-process the data
				(p.nombre.simulation_commencee ?? 0) + (p.nombre.recherche ?? 0) ||
				// If the value is zero, we use simulation terminee instead
				p.nombre.simulation_terminee,
			simulation_terminee: p.nombre.simulation_terminee,
		},
	})) as Visites

	if (filter !== '') {
		return visites
	}

	return mergeVisites(visites, apiRestVisits, statsChoixStatut)
}

function filterIs(value: string, filter: Filter | ''): boolean {
	return typeof filter !== 'string' && filter.chapter2 === value
}

function mergeVisites(...listesDeVisites: Visites[]): Visites {
	return Object.values(
		listesDeVisites
			.flat()
			.reduce<Record<string, Visites[number]>>((acc, visite) => {
				const date = visite.date
				acc[date] ??= {
					date,
					nombre: {
						accueil: 0,
						simulation_commencee: 0,
						simulation_terminee: 0,
					},
				}
				acc[date].nombre.accueil += visite.nombre.accueil
				acc[date].nombre.simulation_commencee +=
					visite.nombre.simulation_commencee
				acc[date].nombre.simulation_terminee ??=
					(acc[date].nombre.simulation_terminee || 0) +
					(visite.nombre.simulation_terminee || 0)

				return acc
			}, {})
	).sort((a, b) => (a.date < b.date ? -1 : 1))
}

const isPAM = (name: string | undefined) =>
	name &&
	[
		'medecin',
		'chirurgien_dentiste',
		'auxiliaire_medical',
		'sage_femme',
	].includes(name)

function filterPage(
	pages: Pageish[],
	filter: Exclude<Filter, 'api-rest'> | ''
) {
	return Object.entries(
		groupBy(
			pages.filter(
				(p) =>
					(!('page' in p) || p.page !== 'accueil_pamc') &&
					(!filter
						? true
						: filter === 'PAM'
						? isPAM(p.page_chapter3)
						: filter.chapter2 === p.page_chapter2 &&
						  (!filter.chapter3 || filter.chapter3 === p.page_chapter3))
			),
			(p) => ('date' in p ? p.date : p.month.slice(0, 10))
		)
	).map(([date, values]) => ({
		date,
		nombre: Object.fromEntries(
			Object.entries(
				groupBy(values, (x) => ('page' in x ? x.page : x.click))
			).map(([key, values]) => [
				key,
				values.reduce((sum, value) => sum + value.nombre, 0),
			])
		),
	}))
}

const computeStatsChoixStatut = (pages: Pageish[]) => {
	const choixStatutPage = pages.filter(
		// eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
		(p) => p.page_chapter2 === PageChapter2.ChoixDuStatut
	)
	const accueil = groupBy(
		choixStatutPage.filter((p) => 'page' in p && p.page === 'accueil'),
		(p) => ('date' in p ? p.date : p.month)
	)
	const commencee = groupBy(
		pages.filter(
			(p) =>
				p.page_chapter3 === 'pas_a_pas' &&
				'page' in p &&
				p.page === 'comparateur'
		),
		(p) => ('date' in p ? p.date : p.month)
	)
	const terminee = groupBy(
		pages.filter((p) => p.page_chapter3 === 'resultat'),
		(p) => ('date' in p ? p.date : p.month)
	)

	return Object.entries(commencee).map(([date, values]) => ({
		date,
		nombre: {
			accueil: accueil[date]?.reduce((acc, p) => acc + p.nombre, 0),
			simulation_commencee: values.reduce((acc, p) => acc + p.nombre, 0),
			simulation_terminee: terminee[date]?.reduce(
				(acc, p) => acc + p.nombre,
				0
			),
		},
	}))
}

function groupByDate(data: Pageish[]) {
	const topTenPageByMonth = Object.entries(
		groupBy(
			data.filter((d) => 'page' in d && d.page === 'accueil'),
			(p) => ('date' in p ? p.date : p.month)
		)
	).map(([date, values]) => ({
		date,
		nombre: Object.fromEntries(
			Object.entries(
				groupBy(values, (x) => x.page_chapter1 + ' / ' + x.page_chapter2)
			).map(
				([k, v]) =>
					[k, v.map((v) => v.nombre).reduce((a, b) => a + b, 0)] as const
			)
		),
	}))

	const topPagesOfAllTime = Object.entries(
		topTenPageByMonth.reduce(
			(acc, { nombre }) => {
				Object.entries(nombre).forEach(([page, visits]) => {
					acc[page] ??= 0
					acc[page] += visits
				})

				return acc
			},
			{} as Record<string, number>
		)
	)
		.sort((a, b) => b[1] - a[1])
		.slice(0, 8)
		.map(([page]) => page)

	return topTenPageByMonth.map(({ date, nombre }) => ({
		date,
		nombre: Object.fromEntries(
			Object.entries(nombre).filter(([page]) =>
				topPagesOfAllTime.includes(page)
			)
		),
	}))
}

/**
 * Return the mean of the current month or the one of the closest next hundred reviews for each month.
 *
 * @param data
 */
function addSatisfactionScore(data: Satisfaction) {
	const satisfactionWithTotal = data.map((d) => {
		const total = Object.values(d.nombre).reduce((a, b) => a + b, 0)
		const positif =
			(d.nombre[SatisfactionLevel.Bien] ?? 0) +
			(d.nombre[SatisfactionLevel.TrèsBien] ?? 0)

		return {
			...d,
			total,
			positif,
		}
	})

	return satisfactionWithTotal.map((d, i) => {
		let total = d.total
		let positif = d.positif
		let level = 1
		while (
			total < 100 &&
			(i - level >= 0 || i + level < satisfactionWithTotal.length)
		) {
			if (i - level >= 0) {
				total += satisfactionWithTotal[i - level].total
				positif += satisfactionWithTotal[i - level].positif
			}
			if (i + level < satisfactionWithTotal.length) {
				total += satisfactionWithTotal[i + level].total
				positif += satisfactionWithTotal[i + level].positif
			}
			level++
		}

		const moyenne = positif / total

		return {
			...d,
			nbMoisMoyenne: level,
			nbAvisMoyenne: total,
			moyenne,
		}
	})
}

function computeQuestionRépondues(
	satisfaction: Satisfaction,
	visites: Visites
): QuestionRépondues {
	const satisfactionByDate = Object.fromEntries(
		satisfaction.map((s) => [s.date, s])
	)

	return visites.map((visite) => {
		const date = visite.date
		const simulationCommencée = visite.nombre.simulation_commencee ?? 0
		const satisfaction = satisfactionByDate[date]?.moyenne ?? 1

		return {
			date,
			nombre: {
				questions_répondues: Math.round(satisfaction * simulationCommencée),
			},
			satisfaction,
			simulationCommencée,
		}
	})
}
