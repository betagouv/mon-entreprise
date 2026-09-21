import * as O from 'effect/Option'
import Engine from 'publicodes'

import { DottedName } from '@/domaine/publicodes/DottedName'

import { getCoefT } from './CoefficientT'
import { MonthState } from './MoisParMois'
import { getSMICMensuelAvecOptions } from './SmicEquivalent'

export type ParamètresRéduction =
	| ParamètresRéductionAvecRémunération
	| ParamètresRéductionSansRémunération
export interface ParamètresRéductionAvecRémunération {
	rémunérationBrute: number
	SMIC: O.Some<number>
	coefT: O.Some<number>
}
interface ParamètresRéductionSansRémunération {
	rémunérationBrute: 0
	SMIC: O.None<number>
	coefT: O.None<number>
}

export const isParamètresRéductionAvecRémunération = (
	params: ParamètresRéduction
): params is ParamètresRéductionAvecRémunération => params.rémunérationBrute > 0

export const getParamètresRéductionParMois = (
	data: MonthState[],
	year: number,
	engine: Engine<DottedName>
): Array<ParamètresRéduction> => {
	return data.reduce(
		(paramètres: Array<ParamètresRéduction>, monthData, monthIndex) => {
			const rémunérationBrute = monthData.rémunérationBrute
			// S'il n'y a pas de rémunération ce mois-ci, il n'y a pas de réduction
			// et il ne faut pas compter le SMIC de ce mois-ci dans le SMIC cumulé.
			if (!rémunérationBrute) {
				paramètres.push({
					rémunérationBrute,
					SMIC: O.none(),
					coefT: O.none(),
				} as ParamètresRéduction)

				return paramètres
			}

			const SMIC = getSMICMensuelAvecOptions(
				year,
				monthIndex,
				monthData.rémunérationBrute,
				monthData.options,
				engine
			)
			const coefT = getCoefT(year, monthIndex, rémunérationBrute, engine)

			paramètres.push({
				rémunérationBrute,
				SMIC: O.some(SMIC),
				coefT: O.some(coefT),
			} as ParamètresRéduction)

			return paramètres
		},
		[]
	)
}
