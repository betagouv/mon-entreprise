import { sumAll } from 'effect/Number'
import { DottedName } from 'modele-social'
import Engine, { PublicodesExpression } from 'publicodes'
import { AnyAction, Dispatch } from 'redux'

import { SimpleRuleEvaluation } from '@/domaine/engine/SimpleRuleEvaluation'
import { Situation } from '@/domaine/Situation'
import { ajusteLaSituation } from '@/store/actions/actions'

/********************************************************************/
/* Types et méthodes communes à la Réduction générale et au Lodeom */
/********************************************************************/

export const réductionGénéraleDottedName =
	'salarié . cotisations . exonérations . réduction générale'
export const lodeomDottedName =
	'salarié . cotisations . exonérations . lodeom . montant'

// TODO: remplacer "salarié . cotisations . assiette" par "salarié . rémunération . brut"
// lorsqu'elle n'incluera plus les frais professionnels.
export const rémunérationBruteDottedName = 'salarié . cotisations . assiette'

const heuresSupplémentairesDottedName =
	'salarié . temps de travail . heures supplémentaires'
const heuresComplémentairesDottedName =
	'salarié . temps de travail . heures complémentaires'

export type RéductionDottedName =
	| typeof réductionGénéraleDottedName
	| typeof lodeomDottedName

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

export type Options = {
	heuresSupplémentaires: number
	heuresComplémentaires: number
	rémunérationETP: number
	rémunérationPrimes: number
	rémunérationHeuresSup: number
}

export type RégularisationMethod = 'annuelle' | 'progressive'

export type SituationType = Situation & {
	[heuresSupplémentairesDottedName]?: {
		explanation: {
			nodeValue: number
		}
	}
	[heuresComplémentairesDottedName]?: {
		valeur: number
	}
}

export type RémunérationBruteInput = {
	unité: string
	valeur: number
}

export type Répartition = {
	IRC: number
	Urssaf: number
	chômage: number
}

export const getDataAfterSituationChange = (
	dottedName: RéductionDottedName,
	situation: SituationType,
	previousSituation: SituationType,
	previousData: MonthState[],
	year: number,
	engine: Engine<DottedName>,
	régularisationMethod?: RégularisationMethod
): MonthState[] => {
	if (!Object.keys(situation).length) {
		return getInitialRéductionMoisParMois(dottedName, year, engine)
	}

	const newOptions = getOptionsFromSituations(previousSituation, situation)

	const updatedData = previousData.map((data) => {
		return {
			...data,
			options: {
				...data.options,
				...newOptions,
			},
		}
	}, [])

	return reevaluateRéductionMoisParMois(
		dottedName,
		updatedData,
		year,
		engine,
		régularisationMethod
	)
}

export const getDataAfterRémunérationChange = (
	dottedName: RéductionDottedName,
	monthIndex: number,
	rémunérationBrute: number,
	previousData: MonthState[],
	year: number,
	engine: Engine<DottedName>,
	dispatch: Dispatch<AnyAction>,
	régularisationMethod?: RégularisationMethod
): MonthState[] => {
	const updatedData = [...previousData]
	updatedData[monthIndex] = {
		...updatedData[monthIndex],
		rémunérationBrute,
	}

	updateRémunérationBruteAnnuelle(updatedData, dispatch)

	return reevaluateRéductionMoisParMois(
		dottedName,
		updatedData,
		year,
		engine,
		régularisationMethod
	)
}

export const getDataAfterOptionsChange = (
	dottedName: RéductionDottedName,
	monthIndex: number,
	options: Options,
	previousData: MonthState[],
	year: number,
	engine: Engine<DottedName>,
	régularisationMethod?: RégularisationMethod
): MonthState[] => {
	const updatedData = [...previousData]
	updatedData[monthIndex] = {
		...updatedData[monthIndex],
		options,
	}

	return reevaluateRéductionMoisParMois(
		dottedName,
		updatedData,
		year,
		engine,
		régularisationMethod
	)
}

export const getInitialRéductionMoisParMois = (
	dottedName: RéductionDottedName,
	year: number,
	engine: Engine<DottedName>
): MonthState[] => {
	const rémunérationBrute =
		(engine.evaluate({
			valeur: rémunérationBruteDottedName,
			arrondi: 'oui',
			unité: '€/mois',
		})?.nodeValue as number) ?? 0
	const heuresSupplémentaires =
		(engine.evaluate({
			valeur: heuresSupplémentairesDottedName,
			unité: 'heures/mois',
		})?.nodeValue as number) ?? 0
	const heuresComplémentaires =
		(engine.evaluate({
			valeur: heuresComplémentairesDottedName,
			unité: 'heures/mois',
		})?.nodeValue as number) ?? 0
	const rémunérationETP = 0
	const rémunérationPrimes = 0
	const rémunérationHeuresSup = 0

	if (!rémunérationBrute) {
		return Array(12).fill({
			rémunérationBrute,
			options: {
				heuresSupplémentaires,
				heuresComplémentaires,
				rémunérationETP,
				rémunérationPrimes,
				rémunérationHeuresSup,
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
	}

	return Array.from({ length: 12 }, (_item, monthIndex) => {
		const date = getDateForContexte(monthIndex, year)

		const réduction = getMonthlyRéduction(
			dottedName,
			date,
			rémunérationBrute,
			{
				heuresSupplémentaires,
				heuresComplémentaires,
				rémunérationETP,
				rémunérationPrimes,
				rémunérationHeuresSup,
			},
			engine
		)
		const répartition = getRépartition(
			dottedName,
			rémunérationBrute,
			réduction,
			engine
		)

		return {
			rémunérationBrute,
			options: {
				heuresSupplémentaires,
				heuresComplémentaires,
				rémunérationETP,
				rémunérationPrimes,
				rémunérationHeuresSup,
			},
			réduction: {
				value: réduction,
				répartition,
			},
			régularisation: {
				value: 0,
				répartition: emptyRépartition,
			},
		}
	})
}

export const reevaluateRéductionMoisParMois = (
	dottedName: RéductionDottedName,
	data: MonthState[],
	year: number,
	engine: Engine<DottedName>,
	régularisationMethod?: RégularisationMethod
): MonthState[] => {
	const totalRémunérationBrute = sumAll(
		data.map((monthData) => monthData.rémunérationBrute)
	)

	if (!totalRémunérationBrute) {
		return data.map((monthData) => {
			return {
				...monthData,
				réductionGénérale: {
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

	const rémunérationBruteCumulées = getRémunérationBruteCumulées(data)
	const SMICCumulés = getSMICCumulés(data, year, engine)
	// Si on laisse l'engine calculer T dans le calcul de la réduction,
	// le résultat ne sera pas bon à cause de l'assiette de cotisations du contexte
	const coefT = engine.evaluate({
		valeur: 'salarié . cotisations . exonérations . T',
	}).nodeValue as number

	const reevaluatedData = data.reduce(
		(reevaluatedData: MonthState[], monthState, monthIndex) => {
			const rémunérationBrute = monthState.rémunérationBrute
			const options = monthState.options
			const réduction = {
				value: 0,
				répartition: emptyRépartition,
			}
			const régularisation = {
				value: 0,
				répartition: emptyRépartition,
			}

			if (!rémunérationBrute) {
				return [
					...reevaluatedData,
					{
						rémunérationBrute,
						options,
						réduction,
						régularisation,
					},
				]
			}

			if (régularisationMethod === 'progressive') {
				// La régularisation progressive du mois N est la différence entre la réduction
				// calculée pour la rémunération totale jusqu'à N (comparée au SMIC équivalent pour ces N mois)
				// et la somme des N-1 réductions déjà accordées (en incluant les régularisations).
				const réductionTotale = getTotalRéduction(
					dottedName,
					rémunérationBruteCumulées[monthIndex],
					SMICCumulés[monthIndex],
					coefT,
					engine
				)
				const réductionCumulée = sumAll(
					reevaluatedData.map(
						(monthData) =>
							monthData.réduction.value + monthData.régularisation.value
					)
				)
				régularisation.value = réductionTotale - réductionCumulée

				if (régularisation.value > 0) {
					réduction.value = régularisation.value
					réduction.répartition = getRépartition(
						dottedName,
						rémunérationBrute,
						réduction.value,
						engine
					)
					régularisation.value = 0
				} else if (régularisation.value < 0) {
					régularisation.répartition = getRépartition(
						dottedName,
						rémunérationBrute,
						régularisation.value,
						engine
					)
				}
			} else {
				const date = getDateForContexte(monthIndex, year)
				réduction.value = getMonthlyRéduction(
					dottedName,
					date,
					rémunérationBrute,
					options,
					engine
				)

				if (
					régularisationMethod === 'annuelle' &&
					monthIndex === data.length - 1
				) {
					// La régularisation annuelle est la différence entre la réduction calculée
					// pour la rémunération annuelle (comparée au SMIC annuel) et la somme des réductions
					// déjà accordées.
					const réductionTotale = getTotalRéduction(
						dottedName,
						rémunérationBruteCumulées[monthIndex],
						SMICCumulés[monthIndex],
						coefT,
						engine
					)
					const currentRéductionGénéraleCumulée =
						réduction.value +
						sumAll(
							reevaluatedData.map((monthData) => monthData.réduction.value)
						)
					régularisation.value =
						réduction.value + (réductionTotale - currentRéductionGénéraleCumulée)

					if (régularisation.value > 0) {
						réduction.value = régularisation.value
						réduction.répartition = getRépartition(
							dottedName,
							rémunérationBrute,
							réduction.value,
							engine
						)
						régularisation.value = 0
					} else if (régularisation.value < 0) {
						régularisation.répartition = getRépartition(
							dottedName,
							rémunérationBrute,
							régularisation.value,
							engine
						)
						réduction.value = 0
					}
				}
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

export const getRépartitionBasique = (
	dottedName: RéductionDottedName,
	currentUnit: string,
	engine: Engine<DottedName>
): Répartition => {
	const IRC =
		(engine.evaluate({
			valeur: `${dottedName} . imputation retraite complémentaire`,
			unité: currentUnit,
		})?.nodeValue as number) ?? 0
	const Urssaf =
		(engine.evaluate({
			valeur: `${dottedName} . imputation sécurité sociale`,
			unité: currentUnit,
		})?.nodeValue as number) ?? 0
	const chômage =
		(engine.evaluate({
			valeur: `${dottedName} . imputation chômage`,
			unité: currentUnit,
		})?.nodeValue as number) ?? 0

	return {
		IRC,
		Urssaf,
		chômage,
	}
}

const emptyRépartition = {
	IRC: 0,
	Urssaf: 0,
	chômage: 0,
}

const getOptionsFromSituations = (
	previousSituation: SituationType,
	newSituation: SituationType
): Partial<Options> => {
	const options = {} as Partial<Options>

	const previousHeuresSupplémentaires =
		previousSituation[heuresSupplémentairesDottedName]?.explanation.nodeValue
	const newHeuresSupplémentaires =
		newSituation[heuresSupplémentairesDottedName]?.explanation.nodeValue
	if (newHeuresSupplémentaires !== previousHeuresSupplémentaires) {
		options.heuresSupplémentaires = newHeuresSupplémentaires || 0
	}

	const previousHeuresComplémentaires =
		previousSituation[heuresComplémentairesDottedName]?.valeur
	const newHeuresComplémentaires =
		newSituation[heuresComplémentairesDottedName]?.valeur
	if (newHeuresComplémentaires !== previousHeuresComplémentaires) {
		options.heuresComplémentaires = newHeuresComplémentaires || 0
	}

	return options
}

const updateRémunérationBruteAnnuelle = (
	data: MonthState[],
	dispatch: Dispatch<AnyAction>
): void => {
	const rémunérationBruteAnnuelle = data.reduce(
		(total: number, monthState: MonthState) =>
			total + monthState.rémunérationBrute,
		0
	)
	dispatch(
		ajusteLaSituation({
			[rémunérationBruteDottedName]: {
				valeur: rémunérationBruteAnnuelle,
				unité: '€/an',
			} as PublicodesExpression,
		} as Record<DottedName, SimpleRuleEvaluation>)
	)
}

const getDateForContexte = (monthIndex: number, year: number): string => {
	const date = new Date(year, monthIndex)

	return date.toLocaleDateString('fr')
}

const getMonthlyRéduction = (
	dottedName: RéductionDottedName,
	date: string,
	rémunérationBrute: number,
	options: Options,
	engine: Engine<DottedName>
): number => {
	const réduction = engine.evaluate({
		valeur: dottedName,
		unité: '€/mois',
		contexte: {
			date,
			[rémunérationBruteDottedName]: rémunérationBrute,
			[heuresSupplémentairesDottedName]: options.heuresSupplémentaires,
			[heuresComplémentairesDottedName]: options.heuresComplémentaires,
		},
	})

	return réduction.nodeValue as number
}

const getTotalRéduction = (
	dottedName: RéductionDottedName,
	rémunérationBrute: number,
	SMIC: number,
	coefT: number,
	engine: Engine<DottedName>
): number => {
	const réductionGénérale = engine.evaluate({
		valeur: dottedName,
		arrondi: 'non',
		contexte: {
			[rémunérationBruteDottedName]: rémunérationBrute,
			'salarié . temps de travail . SMIC': SMIC,
			'salarié . cotisations . exonérations . T': coefT,
		},
	})

	return réductionGénérale.nodeValue as number
}

const getRépartition = (
	dottedName: RéductionDottedName,
	rémunération: number,
	réduction: number,
	engine: Engine<DottedName>
): Répartition => {
	const contexte = {
		[rémunérationBruteDottedName]: rémunération,
		[dottedName]: réduction,
	}
	const IRC =
		(engine.evaluate({
			valeur: `${dottedName} . imputation retraite complémentaire`,
			unité: '€/mois',
			contexte,
		})?.nodeValue as number) ?? 0
	const Urssaf =
		(engine.evaluate({
			valeur: `${dottedName} . imputation sécurité sociale`,
			unité: '€/mois',
			contexte,
		})?.nodeValue as number) ?? 0
	const chômage =
		(engine.evaluate({
			valeur: `${dottedName} . imputation chômage`,
			unité: '€/mois',
			contexte,
		})?.nodeValue as number) ?? 0

	return {
		IRC,
		Urssaf,
		chômage,
	}
}

const getSMICCumulés = (
	data: MonthState[],
	year: number,
	engine: Engine<DottedName>
): number[] => {
	return data.reduce((SMICCumulés: number[], monthData, monthIndex) => {
		// S'il n'y a pas de rémunération ce mois-ci, il n'y a pas de réduction
		// et il ne faut pas compter le SMIC de ce mois-ci dans le SMIC cumulé.
		if (!monthData.rémunérationBrute) {
			SMICCumulés.push(0)

			return SMICCumulés
		}

		const contexte = {
			date: getDateForContexte(monthIndex, year),
		} as Situation

		if (!monthData.options.rémunérationETP) {
			contexte[heuresSupplémentairesDottedName] =
				monthData.options.heuresSupplémentaires
			contexte[heuresComplémentairesDottedName] =
				monthData.options.heuresComplémentaires
		}

		let SMIC = engine.evaluate({
			valeur: 'salarié . temps de travail . SMIC',
			unité: '€/mois',
			contexte,
		}).nodeValue as number

		if (monthData.options.rémunérationETP) {
			const SMICHoraire = engine.evaluate({
				valeur: 'SMIC . horaire',
				contexte,
			}).nodeValue as number
			// On retranche les primes et le paiements des heures supplémentaires à la rémunération versée
			// et on la compare à la rémunération équivalente "mois complet" sans les primes
			const prorata =
				(monthData.rémunérationBrute -
					monthData.options.rémunérationPrimes -
					monthData.options.rémunérationHeuresSup) /
				monthData.options.rémunérationETP
			// On applique ce prorata au SMIC mensuel et on y ajoute les heures supplémentaires et complémentaires
			SMIC =
				SMIC * prorata +
				SMICHoraire *
					(monthData.options.heuresSupplémentaires +
						monthData.options.heuresComplémentaires)
		}

		let SMICCumulé = SMIC
		if (monthIndex > 0) {
			// Il faut aller chercher la dernière valeur positive du SMIC cumulé.
			const previousSMICCumulé =
				SMICCumulés.findLast((SMICCumulé) => SMICCumulé > 0) ?? 0
			SMICCumulé = previousSMICCumulé + SMIC
		}

		SMICCumulés.push(SMICCumulé)

		return SMICCumulés
	}, [])
}

const getRémunérationBruteCumulées = (data: MonthState[]): number[] => {
	return data.reduce(
		(rémunérationBruteCumulées: number[], monthData, monthIndex) => {
			// S'il n'y a pas de rémunération ce mois-ci, il n'y a pas de réduction
			// et elle ne compte pas non plus pour la régularisation des mois à venir.
			if (!monthData.rémunérationBrute) {
				rémunérationBruteCumulées.push(0)

				return rémunérationBruteCumulées
			}

			let rémunérationBruteCumulée = monthData.rémunérationBrute
			if (monthIndex > 0) {
				// Il faut aller chercher la dernière valeur positive de la rémunération cumulée.
				const previousRémunérationBruteCumulée =
					rémunérationBruteCumulées.findLast(
						(rémunérationBruteCumulée) => rémunérationBruteCumulée > 0
					) ?? 0
				rémunérationBruteCumulée =
					previousRémunérationBruteCumulée + monthData.rémunérationBrute
			}

			rémunérationBruteCumulées.push(rémunérationBruteCumulée)

			return rémunérationBruteCumulées
		},
		[]
	)
}
