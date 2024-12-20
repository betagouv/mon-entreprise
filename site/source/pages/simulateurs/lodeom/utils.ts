import { sumAll } from 'effect/Number'
import { DottedName } from 'modele-social'
import Engine from 'publicodes'

import { Situation } from '@/domaine/Situation'

// TODO: remplacer "salarié . cotisations . assiette" par "salarié . rémunération . brut"
// lorsqu'elle n'incluera plus les frais professionnels.
export const rémunérationBruteDottedName = 'salarié . cotisations . assiette'
export const lodeomDottedName =
	'salarié . cotisations . exonérations . lodeom . montant'
export const heuresSupplémentairesDottedName =
	'salarié . temps de travail . heures supplémentaires'
export const heuresComplémentairesDottedName =
	'salarié . temps de travail . heures complémentaires'

export type Répartition = {
	IRC: number
	Urssaf: number
}

export type MonthState = {
	rémunérationBrute: number
	options: Options
	lodeom: {
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

const getDateForContexte = (monthIndex: number, year: number): string => {
	const date = new Date(year, monthIndex)

	return date.toLocaleDateString('fr')
}

const getMonthlyLodeom = (
	date: string,
	rémunérationBrute: number,
	options: Options,
	engine: Engine<DottedName>
): number => {
	const lodeom = engine.evaluate({
		valeur: lodeomDottedName,
		unité: '€/mois',
		contexte: {
			date,
			[rémunérationBruteDottedName]: rémunérationBrute,
			[heuresSupplémentairesDottedName]: options.heuresSupplémentaires,
			[heuresComplémentairesDottedName]: options.heuresComplémentaires,
		},
	})

	return lodeom.nodeValue as number
}

const getTotalLodeom = (
	rémunérationBrute: number,
	SMIC: number,
	coefT: number,
	engine: Engine<DottedName>
): number => {
	const lodeom = engine.evaluate({
		valeur: lodeomDottedName,
		arrondi: 'non',
		contexte: {
			[rémunérationBruteDottedName]: rémunérationBrute,
			'salarié . temps de travail . SMIC': SMIC,
			'salarié . cotisations . exonérations . T': coefT,
		},
	})

	return lodeom.nodeValue as number
}

const emptyRépartition = {
	IRC: 0,
	Urssaf: 0,
}

const getRépartition = (
	rémunération: number,
	réduction: number,
	engine: Engine<DottedName>
): Répartition => {
	const contexte = {
		[rémunérationBruteDottedName]: rémunération,
		[lodeomDottedName]: réduction,
	}
	const IRC =
		(engine.evaluate({
			valeur: `${lodeomDottedName} . imputation retraite complémentaire`,
			unité: '€/mois',
			contexte,
		})?.nodeValue as number) ?? 0
	const Urssaf =
		(engine.evaluate({
			valeur: `${lodeomDottedName} . imputation sécurité sociale`,
			unité: '€/mois',
			contexte,
		})?.nodeValue as number) ?? 0

	return {
		IRC,
		Urssaf,
	}
}

export const getInitialLodeomMoisParMois = (
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
			lodeom: {
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

		const lodeom = getMonthlyLodeom(
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
		const répartition = getRépartition(rémunérationBrute, lodeom, engine)

		return {
			rémunérationBrute,
			options: {
				heuresSupplémentaires,
				heuresComplémentaires,
				rémunérationETP,
				rémunérationPrimes,
				rémunérationHeuresSup,
			},
			lodeom: {
				value: lodeom,
				répartition,
			},
			régularisation: {
				value: 0,
				répartition: emptyRépartition,
			},
		}
	})
}

export const reevaluateLodeomMoisParMois = (
	data: MonthState[],
	engine: Engine<DottedName>,
	year: number,
	régularisationMethod: RégularisationMethod
): MonthState[] => {
	const totalRémunérationBrute = sumAll(
		data.map((monthData) => monthData.rémunérationBrute)
	)

	if (!totalRémunérationBrute) {
		return data.map((monthData) => {
			return {
				...monthData,
				lodeom: {
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
	// Si on laisse l'engine calculer T dans le calcul de l'exonération Lodeom,
	// le résultat ne sera pas bon à cause de l'assiette de cotisations du contexte
	const coefT = engine.evaluate({
		valeur: 'salarié . cotisations . exonérations . T',
	}).nodeValue as number

	const reevaluatedData = data.reduce(
		(reevaluatedData: MonthState[], monthState, monthIndex) => {
			const rémunérationBrute = monthState.rémunérationBrute
			const options = monthState.options
			const lodeom = {
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
						lodeom,
						régularisation,
					},
				]
			}

			if (régularisationMethod === 'progressive') {
				// La régularisation progressive du mois N est la différence entre l'exonération Lodeom
				// calculée pour la rémunération totale jusqu'à N (comparée au SMIC équivalent pour ces N mois)
				// et la somme des N-1 exonérations déjà accordées (en incluant les régularisations).
				const lodeomTotale = getTotalLodeom(
					rémunérationBruteCumulées[monthIndex],
					SMICCumulés[monthIndex],
					coefT,
					engine
				)
				const lodeomCumulée = sumAll(
					reevaluatedData.map(
						(monthData) =>
							monthData.lodeom.value + monthData.régularisation.value
					)
				)
				régularisation.value = lodeomTotale - lodeomCumulée

				if (régularisation.value > 0) {
					lodeom.value = régularisation.value
					lodeom.répartition = getRépartition(
						rémunérationBrute,
						lodeom.value,
						engine
					)
					régularisation.value = 0
				} else if (régularisation.value < 0) {
					régularisation.répartition = getRépartition(
						rémunérationBrute,
						régularisation.value,
						engine
					)
				}
			} else if (régularisationMethod === 'annuelle') {
				const date = getDateForContexte(monthIndex, year)
				lodeom.value = getMonthlyLodeom(
					date,
					rémunérationBrute,
					options,
					engine
				)

				if (monthIndex === data.length - 1) {
					// La régularisation annuelle est la différence entre l'exonération Lodeom calculée
					// pour la rémunération annuelle (comparée au SMIC annuel) et la somme des exonérations
					// Lodeom déjà accordées.
					const lodeomTotale = getTotalLodeom(
						rémunérationBruteCumulées[monthIndex],
						SMICCumulés[monthIndex],
						coefT,
						engine
					)
					const currentLodeomCumulée =
						lodeom.value +
						sumAll(reevaluatedData.map((monthData) => monthData.lodeom.value))
					régularisation.value = lodeomTotale - currentLodeomCumulée

					if (lodeom.value + régularisation.value > 0) {
						lodeom.value += régularisation.value
						lodeom.répartition = getRépartition(
							rémunérationBrute,
							lodeom.value,
							engine
						)
						régularisation.value = 0
					} else if (régularisation.value < 0) {
						régularisation.répartition = getRépartition(
							rémunérationBrute,
							régularisation.value,
							engine
						)
					}
				}
			}

			return [
				...reevaluatedData,
				{
					rémunérationBrute,
					options,
					lodeom,
					régularisation,
				},
			]
		},
		[]
	)

	return reevaluatedData
}

const getSMICCumulés = (
	data: MonthState[],
	year: number,
	engine: Engine<DottedName>
): number[] => {
	return data.reduce((SMICCumulés: number[], monthData, monthIndex) => {
		// S'il n'y a pas de rémunération ce mois-ci, il n'y a pas d'exonération Lodeom
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

const getRémunérationBruteCumulées = (data: MonthState[]) => {
	return data.reduce(
		(rémunérationBruteCumulées: number[], monthData, monthIndex) => {
			// S'il n'y a pas de rémunération ce mois-ci, il n'y a pas d'exonération Lodeom
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
