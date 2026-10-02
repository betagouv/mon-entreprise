import Engine from 'publicodes'

import { DottedName } from '@/domaine/publicodes/DottedName'

import { getCoefT } from './CoefficientT'
import { MonthState } from './MoisParMois'
import { getSMICMensuelAvecOptions } from './SmicEquivalent'

export type ParamètresRéduction =
	| ParamètresRéductionAvecRémunération
	| ParamètresRéductionSansRémunération

export interface ParamètresRéductionAvecRémunération {
	moisRémunéré: true
	rémunérationBrute: number
	SMIC: number
	coefT: number
}

interface ParamètresRéductionSansRémunération {
	moisRémunéré: false
}

export const getParamètresRéductionParMois = (
	data: MonthState[],
	year: number,
	engine: Engine<DottedName>
): Array<ParamètresRéduction> =>
	data.map((monthData, monthIndex) => {
		const rémunérationBrute = monthData.rémunérationBrute
		// S'il n'y a pas de rémunération ce mois-ci, il n'y a pas de réduction
		// et il ne faut pas compter le SMIC de ce mois-ci dans le SMIC cumulé.
		if (rémunérationBrute <= 0) {
			return { moisRémunéré: false }
		}

		return {
			moisRémunéré: true,
			rémunérationBrute,
			SMIC: getSMICMensuelAvecOptions(
				year,
				monthIndex,
				rémunérationBrute,
				monthData.options,
				engine
			),
			coefT: getCoefT(year, monthIndex, rémunérationBrute, engine),
		}
	})
