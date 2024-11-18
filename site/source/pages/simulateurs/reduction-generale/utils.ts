import { sumAll } from 'effect/Number'
import { DottedName } from 'modele-social'
import Engine, { PublicodesExpression } from 'publicodes'

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
	heuresSupplémentaires?: number
	heuresComplémentaires?: number
}

export type RégularisationMethod = 'annuelle' | 'progressive'

export const getRéductionGénéraleFromRémunération = (
	engine: Engine<DottedName>,
	rémunérationBrute: number,
	options: Options
): number => {
	const réductionGénérale = engine.evaluate({
		valeur: réductionGénéraleDottedName,
		unité: '€/mois',
		contexte: {
			[rémunérationBruteDottedName]: rémunérationBrute,
			[heuresSupplémentairesDottedName]: options.heuresSupplémentaires ?? 0,
			[heuresComplémentairesDottedName]: options.heuresComplémentaires ?? 0,
		},
	})

	return réductionGénérale.nodeValue as number
}

export const getInitialRéductionGénéraleMoisParMois = (
	engine: Engine<DottedName>
): MonthState[] => {
	const rémunérationBrute =
		(engine.evaluate({
			valeur: rémunérationBruteDottedName,
			arrondi: 'oui',
			unité: '€/mois',
		})?.nodeValue as number) || 0
	const heuresSupplémentaires =
		(engine.evaluate({
			valeur: heuresSupplémentairesDottedName,
			unité: 'heures/mois',
		})?.nodeValue as number) || 0
	const heuresComplémentaires =
		(engine.evaluate({
			valeur: heuresComplémentairesDottedName,
			unité: 'heures/mois',
		})?.nodeValue as number) || 0
	const réductionGénérale = rémunérationBrute
		? getRéductionGénéraleFromRémunération(engine, rémunérationBrute, {
				heuresSupplémentaires,
				heuresComplémentaires,
		  })
		: 0

	return Array(12).fill({
		rémunérationBrute,
		options: {
			heuresSupplémentaires,
			heuresComplémentaires,
		},
		réductionGénérale,
		régularisation: 0,
	}) as MonthState[]
}

export const reevaluateRéductionGénéraleMoisParMois = (
	data: MonthState[],
	engine: Engine<DottedName>,
	régularisationMethod: RégularisationMethod
): MonthState[] => {
	// Si on laisse l'engine calculer T dans le calcul de la réduction générale,
	// le résultat ne sera pas bon à cause de l'assiette de cotisations du contexte
	const coefT = engine.evaluate({
		valeur: 'salarié . cotisations . exonérations . T',
	}).nodeValue as number

	const heuresSupplémentaires =
		(engine.evaluate({
			valeur: heuresSupplémentairesDottedName,
			unité: 'heures/mois',
		})?.nodeValue as number) || 0
	const heuresComplémentaires =
		(engine.evaluate({
			valeur: heuresComplémentairesDottedName,
			unité: 'heures/mois',
		})?.nodeValue as number) || 0
	const options = {
		heuresSupplémentaires,
		heuresComplémentaires,
	}

	const reevaluatedData = data.reduce(
		(reevaluatedData: MonthState[], monthState: MonthState, index) => {
			const rémunérationBrute = monthState.rémunérationBrute
			let réductionGénérale = 0
			let régularisation = 0

			const partialData = [
				...reevaluatedData,
				{
					rémunérationBrute,
					options,
					réductionGénérale,
					régularisation,
				},
			]

			if (régularisationMethod === 'progressive') {
				régularisation = getRégularisationProgressive(
					index,
					partialData,
					coefT,
					engine
				)
				if (régularisation > 0) {
					réductionGénérale += régularisation
					régularisation = 0
				}
			} else if (régularisationMethod === 'annuelle') {
				réductionGénérale = getRéductionGénéraleFromRémunération(
					engine,
					rémunérationBrute,
					options
				)
				if (index === data.length - 1) {
					régularisation = getRégularisationAnnuelle(
						partialData,
						réductionGénérale,
						engine
					)
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

// La régularisation annuelle est la différence entre la réduction générale calculée
// pour la rémunération annuelle (comparée au SMIC annuel) et la somme des réductions
// générales déjà accordées.
const getRégularisationAnnuelle = (
	data: MonthState[],
	réductionGénéraleDernierMois: number,
	engine: Engine<DottedName>
): number => {
	const totalHeuresSupplémentaires = sumAll(
		data.map((monthData) => monthData.options.heuresSupplémentaires ?? 0)
	)
	const totalHeuresComplémentaires = sumAll(
		data.map((monthData) => monthData.options.heuresComplémentaires ?? 0)
	)
	const realRéductionGénéraleAnnuelle = engine.evaluate({
		valeur: réductionGénéraleDottedName,
		arrondi: 'non',
		unité: '€/an',
		contexte: {
			[heuresSupplémentairesDottedName]: `${totalHeuresSupplémentaires} heures/an`,
			[heuresComplémentairesDottedName]: `${totalHeuresComplémentaires} heures/an`,
		},
	}).nodeValue as number

	const currentRéductionGénéraleAnnuelle =
		réductionGénéraleDernierMois +
		sumAll(data.map((monthData) => monthData.réductionGénérale))

	return realRéductionGénéraleAnnuelle - currentRéductionGénéraleAnnuelle
}

// La régularisation progressive du mois N est la différence entre la réduction générale
// calculée pour la rémunération totale jusqu'à N (comparée au SMIC mensuel * N) et la
// somme des N-1 réductions générales déjà accordées (en incluant les régularisations).
const getRégularisationProgressive = (
	monthIndex: number,
	data: MonthState[],
	coefT: number,
	engine: Engine<DottedName>
): number => {
	if (monthIndex > data.length - 1) {
		return 0
	}
	const nbOfMonths = monthIndex + 1
	const partialData = data.slice(0, nbOfMonths)

	const rémunérationBruteCumulée = sumAll(
		partialData.map((monthData) => monthData.rémunérationBrute)
	)

	if (!rémunérationBruteCumulée) {
		return 0
	}

	// TODO: optimiser le calcul du SMIC
	// (ne pas recalculer l'équivalent SMIC du mois de janvier à chaque mois de l'année)
	const SMICCumulé = partialData.reduce(
		(SMICCumulé: number, monthData: MonthState) => {
			const contexte: PublicodesExpression = {}
			if (monthData.options.heuresSupplémentaires) {
				contexte[heuresSupplémentairesDottedName] =
					monthData.options.heuresSupplémentaires
			}
			if (monthData.options.heuresComplémentaires) {
				contexte[heuresComplémentairesDottedName] =
					monthData.options.heuresComplémentaires
			}

			const SMICCurrentMonth = engine.evaluate({
				valeur: 'salarié . temps de travail . SMIC',
				unité: '€/mois',
				contexte,
			}).nodeValue as number

			return SMICCumulé + SMICCurrentMonth
		},
		0
	)

	const réductionGénéraleTotale = engine.evaluate({
		valeur: réductionGénéraleDottedName,
		arrondi: 'non',
		contexte: {
			[rémunérationBruteDottedName]: rémunérationBruteCumulée,
			'salarié . temps de travail . SMIC': SMICCumulé,
			'salarié . cotisations . exonérations . T': coefT,
		},
	}).nodeValue as number

	const currentRéductionGénéraleCumulée = sumAll(
		partialData.map(
			(monthData) => monthData.réductionGénérale + monthData.régularisation
		)
	)

	return réductionGénéraleTotale - currentRéductionGénéraleCumulée
}
