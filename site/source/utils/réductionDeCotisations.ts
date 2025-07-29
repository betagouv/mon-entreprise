import { sumAll } from 'effect/Number'
import { DottedName } from 'modele-social'
import Engine from 'publicodes'

import { SituationPublicodes } from '@/domaine/SituationPublicodes'

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

export type SituationType = SituationPublicodes & {
	[heuresSupplémentairesDottedName]?: {
		nodeValue: number
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

const defaultRépartition = {
	IRC: 0,
	Urssaf: 0,
	chômage: 0,
}

export const getDataAfterSituationChange = (
	dottedName: RéductionDottedName,
	situation: SituationType,
	previousSituation: SituationType,
	previousData: MonthState[],
	year: number,
	engine: Engine<DottedName>,
	régularisationMethod?: RégularisationMethod,
	withRépartition: boolean = true
): MonthState[] => {
	const pasDeSituation = !Object.keys(situation).length
	if (pasDeSituation) {
		return getInitialRéductionMoisParMois(
			dottedName,
			year,
			engine,
			withRépartition
		)
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
		withRépartition,
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
	régularisationMethod?: RégularisationMethod,
	withRépartition: boolean = true
): MonthState[] => {
	const updatedData = [...previousData]
	updatedData[monthIndex] = {
		...updatedData[monthIndex],
		rémunérationBrute,
	}

	return reevaluateRéductionMoisParMois(
		dottedName,
		updatedData,
		year,
		engine,
		withRépartition,
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
	régularisationMethod?: RégularisationMethod,
	withRépartition: boolean = true
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
		withRépartition,
		régularisationMethod
	)
}

export const getInitialRéductionMoisParMois = (
	dottedName: RéductionDottedName,
	year: number,
	engine: Engine<DottedName>,
	withRépartition: boolean = true
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

	const pasDeRémunération = !rémunérationBrute
	if (pasDeRémunération) {
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
		const réduction = getMonthlyRéduction(
			dottedName,
			year,
			monthIndex,
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
		const répartition = withRépartition
			? getRépartition(dottedName, rémunérationBrute, réduction, engine)
			: defaultRépartition

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

const reevaluateRéductionMoisParMois = (
	dottedName: RéductionDottedName,
	data: MonthState[],
	year: number,
	engine: Engine<DottedName>,
	withRépartition: boolean,
	régularisationMethod?: RégularisationMethod
): MonthState[] => {
	const totalRémunérationBrute = sumAll(
		data.map((monthData) => monthData.rémunérationBrute)
	)

	const pasDeRémunération = !totalRémunérationBrute
	if (pasDeRémunération) {
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

			const pasDeRémunération = !rémunérationBrute
			if (pasDeRémunération) {
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
					réduction.répartition = withRépartition
						? getRépartition(
								dottedName,
								rémunérationBrute,
								réduction.value,
								engine
						  )
						: defaultRépartition
					régularisation.value = 0
				} else if (régularisation.value < 0) {
					régularisation.répartition = withRépartition
						? getRépartition(
								dottedName,
								rémunérationBrute,
								régularisation.value,
								engine
						  )
						: defaultRépartition
				}
			} else {
				réduction.value = getMonthlyRéduction(
					dottedName,
					year,
					monthIndex,
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
						engine
					)
					const currentRéductionGénéraleCumulée =
						réduction.value +
						sumAll(
							reevaluatedData.map((monthData) => monthData.réduction.value)
						)
					régularisation.value =
						réduction.value +
						(réductionTotale - currentRéductionGénéraleCumulée)

					if (régularisation.value > 0) {
						réduction.value = régularisation.value
						réduction.répartition = withRépartition
							? getRépartition(
									dottedName,
									rémunérationBrute,
									réduction.value,
									engine
							  )
							: defaultRépartition
						régularisation.value = 0
					} else if (régularisation.value < 0) {
						régularisation.répartition = withRépartition
							? getRépartition(
									dottedName,
									rémunérationBrute,
									régularisation.value,
									engine
							  )
							: defaultRépartition
						réduction.value = 0
					}
				} else {
					réduction.répartition = withRépartition
						? getRépartition(
								dottedName,
								rémunérationBrute,
								réduction.value,
								engine
						  )
						: defaultRépartition
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
		previousSituation[heuresSupplémentairesDottedName]?.nodeValue
	const newHeuresSupplémentaires =
		newSituation[heuresSupplémentairesDottedName]?.nodeValue
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

const getMonthlyRéduction = (
	dottedName: RéductionDottedName,
	year: number,
	monthIndex: number,
	rémunérationBrute: number,
	options: Options,
	engine: Engine<DottedName>
): number => {
	const SMIC = getSMICMensuelAvecOptions(
		year,
		rémunérationBrute,
		options,
		engine
	)
	const réduction = engine.evaluate({
		valeur: dottedName,
		unité: '€/mois',
		contexte: {
			date: new Date(year, monthIndex).toLocaleDateString('fr'),
			[rémunérationBruteDottedName]: rémunérationBrute,
			'salarié . temps de travail . SMIC': SMIC,
		},
	})

	return réduction.nodeValue as number
}

const getTotalRéduction = (
	dottedName: RéductionDottedName,
	rémunérationBrute: number,
	SMIC: number,
	engine: Engine<DottedName>
): number => {
	const réduction = engine.evaluate({
		valeur: dottedName,
		arrondi: 'non',
		contexte: {
			[rémunérationBruteDottedName]: rémunérationBrute,
			'salarié . temps de travail . SMIC': SMIC,
		},
	})

	return réduction.nodeValue as number
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

/**
 * Le Smic à utiliser est celui du 1er janvier de l'année considérée.
 * (source : https://boss.gouv.fr/portail/accueil/exonerations/allegements-generaux.html#710)
 * Il faut toutefois l'adapter à la durée de travail réalisée ce mois-ci par le ou la salariée
 * (heures supplémentaires, temps partiel, mois incomplet...).
 */
const getSMICMensuelAvecOptions = (
	year: number,
	rémunérationBrute: number,
	options: Options,
	engine: Engine<DottedName>
): number => {
	const contexte = {
		date: new Date(year, 0).toLocaleDateString('fr'),
		[rémunérationBruteDottedName]: rémunérationBrute,
		[heuresSupplémentairesDottedName]: options.heuresSupplémentaires,
		[heuresComplémentairesDottedName]: options.heuresComplémentaires,
	} as SituationPublicodes

	const SMICMensuel = engine.evaluate({
		valeur: 'salarié . temps de travail . SMIC',
		unité: '€/mois',
		contexte,
	}).nodeValue as number

	const moisComplet = !options.rémunérationETP
	if (moisComplet) {
		return SMICMensuel
	}

	// TODO: enlever 'salarié . mois incomplet . rémunération de base mois incomplet'
	// du contexte une fois que la formule de cette règle sera décommentée
	// (cf TODO dans `mois-incomplet.publicodes`)
	// On pourra donc enlever le champ "rémunération des heures sup" du formulaire !
	contexte['salarié . mois incomplet . rémunération de base mois incomplet'] =
		rémunérationBrute -
		options.rémunérationPrimes -
		options.rémunérationHeuresSup
	contexte['salarié . mois incomplet . rémunération équivalente mois complet'] =
		options.rémunérationETP
	if (options.rémunérationPrimes) {
		contexte[
			"salarié . mois incomplet . rémunération non impactée par l'absence"
		] = options.rémunérationPrimes
	}
	const SMIC = engine.evaluate({
		valeur: 'salarié . mois incomplet . SMIC équivalent',
		contexte,
	}).nodeValue as number

	return SMIC
}

const getSMICCumulés = (
	data: MonthState[],
	year: number,
	engine: Engine<DottedName>
): number[] => {
	return data.reduce((SMICCumulés: number[], monthData, monthIndex) => {
		const pasDeRémunération = !monthData.rémunérationBrute
		// S'il n'y a pas de rémunération ce mois-ci, il n'y a pas de réduction
		// et il ne faut pas compter le SMIC de ce mois-ci dans le SMIC cumulé.
		if (pasDeRémunération) {
			SMICCumulés.push(0)

			return SMICCumulés
		}

		const SMIC = getSMICMensuelAvecOptions(
			year,
			monthData.rémunérationBrute,
			monthData.options,
			engine
		)

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
			const pasDeRémunération = !monthData.rémunérationBrute
			// S'il n'y a pas de rémunération ce mois-ci, il n'y a pas de réduction
			// et elle ne compte pas non plus pour la régularisation des mois à venir.
			if (pasDeRémunération) {
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
