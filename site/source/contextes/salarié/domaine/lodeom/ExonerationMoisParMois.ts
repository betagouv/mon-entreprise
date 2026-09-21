import { take } from 'effect/Array'
import { sumAll } from 'effect/Number'
import Engine from 'publicodes'

import { DottedName } from '@/domaine/publicodes/DottedName'

import { MonthState, RégularisationMethod } from './MoisParMois'
import { Options } from './Options'
import { getParamètresRéductionParMois } from './ParametresReduction'
import { getMonthlyRéduction, getTotalRéduction } from './Reduction'
import { emptyRépartition, getRépartition } from './Repartition'

export const getDataAfterSituationChange = (
	data: MonthState[],
	year: number,
	engine: Engine<DottedName>,
	régularisationMethod: RégularisationMethod,
	withRépartitionAndRégularisation: boolean = true
): MonthState[] =>
	reevaluateRéductionMoisParMois(
		data,
		year,
		engine,
		withRépartitionAndRégularisation,
		withRépartitionAndRégularisation ? régularisationMethod : undefined
	)

export const getDataAfterGlobalOptionsChange = (
	options: Partial<Options>,
	previousData: MonthState[],
	year: number,
	engine: Engine<DottedName>,
	régularisationMethod: RégularisationMethod,
	withRépartitionAndRégularisation: boolean = true
): MonthState[] => {
	const updatedData = previousData.map((data) => ({
		...data,
		options: {
			...data.options,
			...options,
		},
	}))

	return reevaluateRéductionMoisParMois(
		updatedData,
		year,
		engine,
		withRépartitionAndRégularisation,
		withRépartitionAndRégularisation ? régularisationMethod : undefined
	)
}

export const getDataAfterRémunérationChange = (
	monthIndex: number,
	rémunérationBrute: number,
	previousData: MonthState[],
	year: number,
	engine: Engine<DottedName>,
	régularisationMethod: RégularisationMethod,
	withRépartitionAndRégularisation: boolean = true
): MonthState[] => {
	const updatedData = [...previousData]
	updatedData[monthIndex] = {
		...updatedData[monthIndex],
		rémunérationBrute,
	}

	return reevaluateRéductionMoisParMois(
		updatedData,
		year,
		engine,
		withRépartitionAndRégularisation,
		withRépartitionAndRégularisation ? régularisationMethod : undefined
	)
}

export const getDataAfterOptionsChange = (
	monthIndex: number,
	options: Options,
	previousData: MonthState[],
	year: number,
	engine: Engine<DottedName>,
	régularisationMethod: RégularisationMethod,
	withRépartitionAndRégularisation: boolean = true
): MonthState[] => {
	const updatedData = [...previousData]
	updatedData[monthIndex] = {
		...updatedData[monthIndex],
		options,
	}

	return reevaluateRéductionMoisParMois(
		updatedData,
		year,
		engine,
		withRépartitionAndRégularisation,
		withRépartitionAndRégularisation ? régularisationMethod : undefined
	)
}

const reevaluateRéductionMoisParMois = (
	data: MonthState[],
	year: number,
	engine: Engine<DottedName>,
	withRépartition: boolean,
	régularisationMethod?: RégularisationMethod
): MonthState[] => {
	const totalRémunérationBrute = sumAll(
		data.map((monthData) => monthData.rémunérationBrute)
	)

	const aucuneRémunération = !totalRémunérationBrute
	if (aucuneRémunération) {
		return data.map((monthData) => {
			return {
				...monthData,
				réduction: {
					value: 0,
					répartition: emptyRépartition,
				},
				régularisation: {
					value: 0,
					répartition: emptyRépartition,
				},
			}
		})
	}

	const paramètresRéductionParMois = getParamètresRéductionParMois(
		data,
		year,
		engine
	)

	const reevaluatedData = data.reduce(
		(reevaluatedData: MonthState[], monthState, monthIndex) => {
			const { rémunérationBrute, options } = monthState
			const réduction = {
				value: 0,
				répartition: emptyRépartition,
			}
			const régularisation = {
				value: 0,
				répartition: emptyRépartition,
			}

			// S'il n'y a pas de rémunération, il n'y a pas de réduction.
			// Ceci est valable en régularisation progressive ou sans régularisation
			// (pour Saint-Barthélémy et Saint-Martin).
			// Mais en régularisation annuelle, au mois de décembre il faut calculer la
			// régularisation éventuelle même en l'absence de rémunération.

			const décembre = monthIndex === data.length - 1
			if (régularisationMethod === 'progressive' && rémunérationBrute) {
				// La régularisation progressive du mois N est la différence entre la réduction
				// calculée pour la rémunération totale jusqu'à N (comparée au SMIC équivalent pour ces N mois)
				// et la somme des N-1 réductions déjà accordées (en incluant les régularisations).
				const réductionTotale = getTotalRéduction(
					take(paramètresRéductionParMois, monthIndex + 1),
					engine
				)
				const réductionCumulée = sumAll(
					reevaluatedData.map(
						(monthData) =>
							monthData.réduction.value + monthData.régularisation.value
					)
				)

				if (réductionTotale > réductionCumulée) {
					// Si la réduction totale est *supérieure* à la somme des réductions
					// accordées, il y a une *réduction* ce mois-ci aussi.
					réduction.value = réductionTotale - réductionCumulée
					réduction.répartition = withRépartition
						? getRépartition(rémunérationBrute, réduction.value, engine)
						: emptyRépartition
				} else if (réductionTotale < réductionCumulée) {
					// Si la réduction totale est *inférieure* à la somme des réductions
					// accordées, c'est qu'il y a un trop-perçu de réductions et il y a
					// alors une *régularisation* ce mois-ci
					régularisation.value = réductionTotale - réductionCumulée
					régularisation.répartition = withRépartition
						? getRépartition(rémunérationBrute, régularisation.value, engine)
						: emptyRépartition
				}
			} else if (régularisationMethod === 'annuelle' && décembre) {
				// La régularisation annuelle suit la même logique que la progressive mais
				// elle n'est calculée qu'au mois de décembre en comparant la somme des
				// réductions accordées et la réduction calculée pour la rémunération
				// annuelle.
				const réductionTotale = getTotalRéduction(
					paramètresRéductionParMois,
					engine
				)
				const currentRéductionCumulée = sumAll(
					reevaluatedData.map((monthData) => monthData.réduction.value)
				)

				if (réductionTotale > currentRéductionCumulée) {
					// Si la réduction totale est *supérieure* à la somme des réductions
					// accordées, il y a une *réduction* ce mois-ci aussi.
					réduction.value = réductionTotale - currentRéductionCumulée
					réduction.répartition = withRépartition
						? getRépartition(rémunérationBrute, réduction.value, engine)
						: emptyRépartition
				} else if (réductionTotale < currentRéductionCumulée) {
					// Si la réduction totale est *inférieure* à la somme des réductions
					// accordées, c'est qu'il y a un trop-perçu de réductions et il y a
					// alors une *régularisation* ce mois-ci
					régularisation.value = réductionTotale - currentRéductionCumulée
					régularisation.répartition = withRépartition
						? getRépartition(rémunérationBrute, régularisation.value, engine)
						: emptyRépartition
				}
			} else if (rémunérationBrute) {
				// Cas :
				// - régularisation annuelle pour les mois avant décembre
				// - pas de régularisation (Saint-Barthélémy, Saint-Martin)
				// (et avec rémunération, sinon pas de réduction)
				réduction.value = getMonthlyRéduction(
					year,
					monthIndex,
					rémunérationBrute,
					options,
					engine
				)
				réduction.répartition = withRépartition
					? getRépartition(rémunérationBrute, réduction.value, engine)
					: emptyRépartition
			}

			return [
				...reevaluatedData,
				{
					rémunérationBrute,
					options,
					réduction,
					régularisation,
				},
			]
		},
		[]
	)

	return reevaluatedData
}
