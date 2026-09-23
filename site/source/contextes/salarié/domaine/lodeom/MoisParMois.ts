import { sumAll } from 'effect/Number'

import { Options } from './Options'
import { emptyRépartition, Répartition } from './Repartition'

export type MonthState = {
	rémunérationBrute: number
	options: Options
	réduction: {
		value: number
		répartition: Répartition
	}
	régularisation: {
		value: number
		répartition: Répartition
	}
}

export type RégularisationMethod = 'annuelle' | 'progressive'

export const initialRéductionMoisParMois = Array(12).fill({
	rémunérationBrute: 0,
	options: {
		heuresSupplémentaires: 0,
		heuresComplémentaires: 0,
		rémunérationETP: 0,
		rémunérationPrimes: 0,
	},
	réduction: {
		value: 0,
		répartition: emptyRépartition,
	},
	régularisation: {
		value: 0,
		répartition: emptyRépartition,
	},
}) as MonthState[]

export const rémunérationBruteAnnuelle = (données: MonthState[]): number =>
	sumAll(données.map((mois) => mois.rémunérationBrute))
