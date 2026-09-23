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
			const décembre = monthIndex === data.length - 1

			const aucunMontant = { value: 0, répartition: emptyRépartition }
			const montantRéparti = (value: number) => ({
				value,
				répartition: withRépartition
					? getRépartition(rémunérationBrute, value, engine)
					: emptyRépartition,
			})

			// Un écart positif entre la réduction due pour la période et celle déjà
			// accordée ouvre une *réduction* ce mois-ci ; un écart négatif signale un
			// trop-perçu et donne lieu à une *régularisation*.
			const ventile = (écart: number) =>
				écart > 0
					? { réduction: montantRéparti(écart), régularisation: aucunMontant }
					: écart < 0
						? { réduction: aucunMontant, régularisation: montantRéparti(écart) }
						: { réduction: aucunMontant, régularisation: aucunMontant }

			const cumul = (montantDuMois: (mois: MonthState) => number) =>
				sumAll(reevaluatedData.map(montantDuMois))

			// S'il n'y a pas de rémunération, il n'y a pas de réduction. Ceci est valable
			// en régularisation progressive ou sans régularisation (Saint-Barthélémy et
			// Saint-Martin). Mais en régularisation annuelle, au mois de décembre, il faut
			// calculer la régularisation éventuelle même en l'absence de rémunération.
			const montantsDuMois = () => {
				// La régularisation progressive du mois N compare la réduction due pour la
				// rémunération cumulée jusqu'à N — face au SMIC équivalent de ces N mois —
				// aux N-1 réductions déjà accordées, régularisations comprises.
				if (régularisationMethod === 'progressive' && rémunérationBrute) {
					return ventile(
						getTotalRéduction(
							take(paramètresRéductionParMois, monthIndex + 1),
							engine
						) -
							cumul((mois) => mois.réduction.value + mois.régularisation.value)
					)
				}

				// La régularisation annuelle suit la même logique, mais sur l'année entière
				// et au seul mois de décembre.
				if (régularisationMethod === 'annuelle' && décembre) {
					return ventile(
						getTotalRéduction(paramètresRéductionParMois, engine) -
							cumul((mois) => mois.réduction.value)
					)
				}

				// Régularisation annuelle avant décembre, ou absence de régularisation.
				if (rémunérationBrute) {
					return {
						réduction: montantRéparti(
							getMonthlyRéduction(
								year,
								monthIndex,
								rémunérationBrute,
								options,
								engine
							)
						),
						régularisation: aucunMontant,
					}
				}

				return { réduction: aucunMontant, régularisation: aucunMontant }
			}

			return [
				...reevaluatedData,
				{
					rémunérationBrute,
					options,
					...montantsDuMois(),
				},
			]
		},
		[]
	)

	return reevaluatedData
}
