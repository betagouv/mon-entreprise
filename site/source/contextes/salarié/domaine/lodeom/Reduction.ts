import { pipe } from 'effect'
import { last, map } from 'effect/Array'
import { sumAll } from 'effect/Number'
import * as O from 'effect/Option'
import Engine from 'publicodes'

import { DottedName } from '@/domaine/publicodes/DottedName'

import { Options } from './Options'
import {
	ParamètresRéduction,
	ParamètresRéductionAvecRémunération,
} from './ParametresReduction'
import {
	getDateForContexte,
	lodeomDottedName,
	rémunérationBruteDottedName,
} from './publicodes'
import { getSMICMensuelAvecOptions } from './SmicEquivalent'

export const getMonthlyRéduction = (
	year: number,
	monthIndex: number,
	rémunérationBrute: number,
	options: Options,
	engine: Engine<DottedName>
): number => {
	const date = getDateForContexte(year, monthIndex)
	const SMIC = getSMICMensuelAvecOptions(
		year,
		monthIndex,
		rémunérationBrute,
		options,
		engine
	)
	const réduction = engine.evaluate({
		valeur: lodeomDottedName,
		unité: '€/mois',
		contexte: {
			date,
			[rémunérationBruteDottedName]: rémunérationBrute,
			'salarié . temps de travail . SMIC': SMIC,
		},
	})

	return réduction.nodeValue as number
}

/**
 * Paramètres de calcul de la réduction :
 * - rémunération totale
 * - SMIC équivalent au temps de travail total (pas de rémunération => pas de SMIC équivalent)
 * En cas de variation de coef T : calcul sur chaque période de coef T identique et somme des résultats
 */
export const getTotalRéduction = (
	paramètresRéductionParMois: Array<ParamètresRéduction>,
	engine: Engine<DottedName>
): number => {
	const périodes = paramètresRéductionParMois.reduce(
		(
			paramètresRéductionParPériode: Array<
				Array<ParamètresRéductionAvecRémunération>
			>,
			paramètresRéductionMois
		) => {
			if (!paramètresRéductionMois.moisRémunéré) {
				return paramètresRéductionParPériode
			}

			const périodeEnCoursOption = last(paramètresRéductionParPériode)
			const pasDePériodeEnCours = O.isNone(périodeEnCoursOption)

			if (pasDePériodeEnCours) {
				const nouvellePériode = [paramètresRéductionMois]
				paramètresRéductionParPériode.push(nouvellePériode)

				return paramètresRéductionParPériode
			}

			const périodeEnCours = périodeEnCoursOption.value
			const dernierParamètresRéductionDeLaPériodeEnCours =
				périodeEnCours[périodeEnCours.length - 1]

			const rémunérationBruteCumulée =
				dernierParamètresRéductionDeLaPériodeEnCours.rémunérationBrute
			const SMICCumulé = dernierParamètresRéductionDeLaPériodeEnCours.SMIC
			const dernierCoefT = dernierParamètresRéductionDeLaPériodeEnCours.coefT
			const coefTMois = paramètresRéductionMois.coefT

			if (coefTMois !== dernierCoefT) {
				const nouvellePériode = [paramètresRéductionMois]
				paramètresRéductionParPériode.push(nouvellePériode)

				return paramètresRéductionParPériode
			}

			périodeEnCours.push({
				moisRémunéré: true,
				rémunérationBrute:
					rémunérationBruteCumulée + paramètresRéductionMois.rémunérationBrute,
				SMIC: SMICCumulé + paramètresRéductionMois.SMIC,
				coefT: dernierCoefT,
			})

			return paramètresRéductionParPériode
		},
		[]
	)

	return pipe(
		périodes,
		map(last),
		map(O.map(getRéduction(engine))),
		map(O.getOrThrow),
		sumAll
	)
}

const getRéduction =
	(engine: Engine<DottedName>) =>
	(paramètresRéduction: ParamètresRéductionAvecRémunération) =>
		engine.evaluate({
			valeur: lodeomDottedName,
			arrondi: 'non',
			contexte: {
				[rémunérationBruteDottedName]: paramètresRéduction.rémunérationBrute,
				'salarié . temps de travail . SMIC': paramètresRéduction.SMIC,
				'salarié . cotisations . exonérations . T': paramètresRéduction.coefT,
			},
		}).nodeValue as number
