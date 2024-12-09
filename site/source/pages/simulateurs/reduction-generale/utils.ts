import { sumAll } from 'effect/Number'
import { DottedName } from 'modele-social'
import Engine from 'publicodes'

// TODO: remplacer "salarié . cotisations . assiette" par "salarié . rémunération . brut"
// lorsqu'elle n'incluera plus les frais professionnels.
export const rémunérationBruteDottedName = 'salarié . cotisations . assiette'
export const réductionGénéraleDottedName =
	'salarié . cotisations . exonérations . réduction générale'
export const heuresSupplémentairesDottedName =
	'salarié . temps de travail . heures supplémentaires'
export const heuresComplémentairesDottedName =
	'salarié . temps de travail . heures complémentaires'

export type MonthState = {
	rémunérationBrute: number
	options: Options
	réductionGénérale: number
	régularisation: number
}

export type Options = {
	heuresSupplémentaires: number
	heuresComplémentaires: number
}

export type RégularisationMethod = 'annuelle' | 'progressive'

const getDateForContexte = (monthIndex: number, year: number): string => {
	const date = new Date(year, monthIndex)

	return date.toLocaleDateString('fr')
}

const getMonthlyRéductionGénérale = (
	date: string,
	rémunérationBrute: number,
	options: Options,
	engine: Engine<DottedName>
): number => {
	const réductionGénérale = engine.evaluate({
		valeur: réductionGénéraleDottedName,
		unité: '€/mois',
		contexte: {
			date,
			[rémunérationBruteDottedName]: rémunérationBrute,
			[heuresSupplémentairesDottedName]: options.heuresSupplémentaires,
			[heuresComplémentairesDottedName]: options.heuresComplémentaires,
		},
	})

	return réductionGénérale.nodeValue as number
}

const getTotalRéductionGénérale = (
	rémunérationBrute: number,
	SMIC: number,
	coefT: number,
	engine: Engine<DottedName>
): number => {
	const réductionGénérale = engine.evaluate({
		valeur: réductionGénéraleDottedName,
		arrondi: 'non',
		contexte: {
			[rémunérationBruteDottedName]: rémunérationBrute,
			'salarié . temps de travail . SMIC': SMIC,
			'salarié . cotisations . exonérations . T': coefT,
		},
	})

	return réductionGénérale.nodeValue as number
}

export const getInitialRéductionGénéraleMoisParMois = (
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

	if (!rémunérationBrute) {
		return Array(12).fill({
			rémunérationBrute,
			options: {
				heuresSupplémentaires,
				heuresComplémentaires,
			},
			réductionGénérale: 0,
			régularisation: 0,
		}) as MonthState[]
	}

	return Array.from({ length: 12 }, (_item, monthIndex) => {
		const date = getDateForContexte(monthIndex, year)

		const réductionGénérale = getMonthlyRéductionGénérale(
			date,
			rémunérationBrute,
			{
				heuresSupplémentaires,
				heuresComplémentaires,
			},
			engine
		)

		return {
			rémunérationBrute,
			options: {
				heuresSupplémentaires,
				heuresComplémentaires,
			},
			réductionGénérale,
			régularisation: 0,
		}
	})
}

export const reevaluateRéductionGénéraleMoisParMois = (
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
				réductionGénérale: 0,
				régularisation: 0,
			}
		})
	}

	const rémunérationBruteCumulées = getRémunérationBruteCumulées(data)
	const SMICCumulés = getSMICCumulés(data, year, engine)
	// Si on laisse l'engine calculer T dans le calcul de la réduction générale,
	// le résultat ne sera pas bon à cause de l'assiette de cotisations du contexte
	const coefT = engine.evaluate({
		valeur: 'salarié . cotisations . exonérations . T',
	}).nodeValue as number

	const reevaluatedData = data.reduce(
		(reevaluatedData: MonthState[], monthState, monthIndex) => {
			const rémunérationBrute = monthState.rémunérationBrute
			const options = monthState.options
			let réductionGénérale = 0
			let régularisation = 0

			if (!rémunérationBrute) {
				return [
					...reevaluatedData,
					{
						rémunérationBrute,
						options,
						réductionGénérale,
						régularisation,
					},
				]
			}

			if (régularisationMethod === 'progressive') {
				// La régularisation progressive du mois N est la différence entre la réduction générale
				// calculée pour la rémunération totale jusqu'à N (comparée au SMIC équivalent pour ces N mois)
				// et la somme des N-1 réductions générales déjà accordées (en incluant les régularisations).
				const réductionGénéraleTotale = getTotalRéductionGénérale(
					rémunérationBruteCumulées[monthIndex],
					SMICCumulés[monthIndex],
					coefT,
					engine
				)
				const réductionGénéraleCumulée = sumAll(
					reevaluatedData.map(
						(monthData) =>
							monthData.réductionGénérale + monthData.régularisation
					)
				)
				régularisation = réductionGénéraleTotale - réductionGénéraleCumulée

				if (régularisation > 0) {
					réductionGénérale = régularisation
					régularisation = 0
				}
			} else if (régularisationMethod === 'annuelle') {
				const date = getDateForContexte(monthIndex, year)
				réductionGénérale = getMonthlyRéductionGénérale(
					date,
					rémunérationBrute,
					options,
					engine
				)

				if (monthIndex === data.length - 1) {
					// La régularisation annuelle est la différence entre la réduction générale calculée
					// pour la rémunération annuelle (comparée au SMIC annuel) et la somme des réductions
					// générales déjà accordées.
					const réductionGénéraleTotale = getTotalRéductionGénérale(
						rémunérationBruteCumulées[monthIndex],
						SMICCumulés[monthIndex],
						coefT,
						engine
					)
					const currentRéductionGénéraleCumulée =
						réductionGénérale +
						sumAll(
							reevaluatedData.map((monthData) => monthData.réductionGénérale)
						)
					régularisation =
						réductionGénéraleTotale - currentRéductionGénéraleCumulée

					if (réductionGénérale + régularisation > 0) {
						réductionGénérale += régularisation
						régularisation = 0
					}
				}
			}

			return [
				...reevaluatedData,
				{
					rémunérationBrute,
					options,
					réductionGénérale,
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
		const SMIC = engine.evaluate({
			valeur: 'salarié . temps de travail . SMIC',
			unité: '€/mois',
			contexte: {
				date: getDateForContexte(monthIndex, year),
				[heuresSupplémentairesDottedName]:
					monthData.options.heuresSupplémentaires,
				[heuresComplémentairesDottedName]:
					monthData.options.heuresComplémentaires,
			},
		}).nodeValue as number

		if (monthIndex < 1) {
			return [SMIC]
		}

		// S'il n'y a pas de rémunération ce mois-ci, il n'y a pas de réduction générale
		// et il ne faut pas compter le SMIC de ce mois-ci dans le SMIC cumulé.
		let SMICCumulé = 0
		// S'il y a une rémunération ce mois-ci, il faut aller chercher la dernière valeur
		// positive du SMIC cumulé.
		if (monthData.rémunérationBrute > 0) {
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
			const rémunérationBrute = monthData.rémunérationBrute

			if (monthIndex < 1) {
				return [rémunérationBrute]
			}

			// S'il n'y a pas de rémunération ce mois-ci, il n'y a pas de réduction générale
			// et elle ne compte pas non plus pour la régularisation des mois à venir.
			let rémunérationBruteCumulée = 0
			// S'il y a une rémunération ce mois-ci, il faut aller chercher la dernière valeur
			// positive de la rémunération cumulée.
			if (rémunérationBrute > 0) {
				const previousRémunérationBruteCumulée =
					rémunérationBruteCumulées.findLast(
						(rémunérationBruteCumulée) => rémunérationBruteCumulée > 0
					) ?? 0
				rémunérationBruteCumulée =
					previousRémunérationBruteCumulée + rémunérationBrute
			}

			rémunérationBruteCumulées.push(rémunérationBruteCumulée)

			return rémunérationBruteCumulées
		},
		[]
	)
}
