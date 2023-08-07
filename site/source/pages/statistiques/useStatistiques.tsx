import { useMemo } from 'react'
import { Trans } from 'react-i18next'

import { Body } from '@/design-system/typography/paragraphs'
import { groupBy } from '@/utils'

import { Page, PageChapter2, PageSatisfaction, StatsStruct } from './types'

type Pageish = Page | PageSatisfaction

export type Filter =
	| { chapter2: PageChapter2; chapter3?: string }
	| 'PAM'
	| 'api-rest'

export function useStatistiques({
	period,
	stats,
	filter,
}: {
	period: 'mois' | 'jours'
	stats: StatsStruct
	filter: Filter | ''
}) {
	const visites = useMemo(() => {
		const rawData = period === 'jours' ? stats.visitesJours : stats.visitesMois
		if (!filter) {
			return rawData.site
		}
		if (filter === 'api-rest') {
			return (rawData.api ?? []).map(({ date, ...nombre }) => ({
				date,
				nombre,
				info:
					(period === 'jours' ? '2023-06-16' : '2023-06-01') === date ? (
						<ChangeJune2023 />
					) : null,
			}))
		}
		if (
			typeof filter !== 'string' &&
			filter.chapter2 === PageChapter2.ChoixDuStatut
		) {
			const pages = rawData.pages as Pageish[]

			return statsChoixStatut(pages)
		}

		return filterPage(rawData.pages as Pageish[], filter)
	}, [period, filter])

	const repartition = useMemo(() => {
		const rawData = stats.visitesMois

		return groupByDate(rawData.pages as Pageish[])
	}, [])

	const satisfaction = useMemo(() => {
		if (filter === 'api-rest') {
			return []
		}

		return filterPage(stats.satisfaction as Pageish[], filter)
	}, [filter]) as Array<{
		date: string
		nombre: Record<string, number>
		percent: Record<string, number>
	}>

	return {
		visites,
		repartition,
		satisfaction,
	}
}

const ChangeJune2023 = () => (
	<Body style={{ maxWidth: '350px' }}>
		<Trans i18nKey="stats.change_june_2023">
			Ajout d'un cache sur l'API pour améliorer les performances et réduire le
			nombre de requêtes.
		</Trans>
	</Body>
)

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
			(p) => ('date' in p ? p.date : p.month)
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

const statsChoixStatut = (pages: Pageish[]) => {
	const choixStatutPage = pages.filter(
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
				p.page === 'recherche_activite'
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

export type Visites = ReturnType<typeof useStatistiques>['visites']

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
