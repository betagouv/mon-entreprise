import { take } from 'effect/Array'
import { sumAll } from 'effect/Number'
import Engine from 'publicodes'

import { DottedName } from '@/domaine/publicodes/DottedName'

import {
	MonthState,
	RégularisationMethod,
	rémunérationBruteAnnuelle,
} from './MoisParMois'
import { Options } from './Options'
import { getParamètresRéductionParMois } from './ParametresReduction'
import { getMonthlyRéduction, getTotalRéduction } from './Reduction'
import { emptyRépartition, getRépartition } from './Repartition'

export type ParamètresDeCalcul = {
	année: number
	moteur: Engine<DottedName>
	régularisation: RégularisationMethod | 'sans'
}

export const getDataAfterSituationChange = (
	data: MonthState[],
	paramètres: ParamètresDeCalcul
): MonthState[] => reevaluateRéductionMoisParMois(data, paramètres)

export const getDataAfterGlobalOptionsChange = (
	options: Partial<Options>,
	previousData: MonthState[],
	paramètres: ParamètresDeCalcul
): MonthState[] => {
	const updatedData = previousData.map((data) => ({
		...data,
		options: {
			...data.options,
			...options,
		},
	}))

	return reevaluateRéductionMoisParMois(updatedData, paramètres)
}

export const getDataAfterRémunérationChange = (
	monthIndex: number,
	rémunérationBrute: number,
	previousData: MonthState[],
	paramètres: ParamètresDeCalcul
): MonthState[] => {
	const updatedData = [...previousData]
	updatedData[monthIndex] = {
		...updatedData[monthIndex],
		rémunérationBrute,
	}

	return reevaluateRéductionMoisParMois(updatedData, paramètres)
}

export const getDataAfterOptionsChange = (
	monthIndex: number,
	options: Options,
	previousData: MonthState[],
	paramètres: ParamètresDeCalcul
): MonthState[] => {
	const updatedData = [...previousData]
	updatedData[monthIndex] = {
		...updatedData[monthIndex],
		options,
	}

	return reevaluateRéductionMoisParMois(updatedData, paramètres)
}

const reevaluateRéductionMoisParMois = (
	data: MonthState[],
	{ année, moteur, régularisation }: ParamètresDeCalcul
): MonthState[] => {
	// Les zones qui ne donnent pas lieu à régularisation n'affichent pas non plus
	// la répartition de l'exonération.
	const avecRépartition = régularisation !== 'sans'

	const aucuneRémunération = !rémunérationBruteAnnuelle(data)
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
		année,
		moteur
	)

	const reevaluatedData = data.reduce(
		(reevaluatedData: MonthState[], monthState, monthIndex) => {
			const { rémunérationBrute, options } = monthState
			const décembre = monthIndex === data.length - 1

			const aucunMontant = { value: 0, répartition: emptyRépartition }
			const montantRéparti = (value: number) => ({
				value,
				répartition: avecRépartition
					? getRépartition(rémunérationBrute, value, moteur)
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
				if (régularisation === 'progressive' && rémunérationBrute) {
					return ventile(
						getTotalRéduction(
							take(paramètresRéductionParMois, monthIndex + 1),
							moteur
						) -
							cumul((mois) => mois.réduction.value + mois.régularisation.value)
					)
				}

				// La régularisation annuelle suit la même logique, mais sur l'année entière
				// et au seul mois de décembre.
				if (régularisation === 'annuelle' && décembre) {
					return ventile(
						getTotalRéduction(paramètresRéductionParMois, moteur) -
							cumul((mois) => mois.réduction.value)
					)
				}

				// Régularisation annuelle avant décembre, ou absence de régularisation.
				if (rémunérationBrute) {
					return {
						réduction: montantRéparti(
							getMonthlyRéduction(
								année,
								monthIndex,
								rémunérationBrute,
								options,
								moteur
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
