import { sumAll } from 'effect/Number'
import { DottedName } from 'modele-social'
import Engine from 'publicodes'

// TODO: remplacer "salarié . cotisations . assiette" par "salarié . rémunération . brut"
// lorsqu'elle n'incluera plus les frais professionnels.
export const rémunérationBruteDottedName = 'salarié . cotisations . assiette'
export const réductionGénéraleDottedName =
	'salarié . cotisations . exonérations . réduction générale'

export type MonthState = {
	rémunérationBrute: number
	réductionGénérale: number
	régularisation: number
}

export type RégularisationMethod = 'annuelle' | 'progressive'

export const getRéductionGénéraleFromRémunération = (
	engine: Engine<DottedName>,
	rémunérationBrute: number
): number => {
	const réductionGénérale = engine.evaluate({
		valeur: réductionGénéraleDottedName,
		unité: '€/mois',
		contexte: {
			[rémunérationBruteDottedName]: rémunérationBrute,
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
	const réductionGénérale = rémunérationBrute
		? getRéductionGénéraleFromRémunération(engine, rémunérationBrute)
		: 0

	return Array(12).fill({
		rémunérationBrute,
		réductionGénérale,
		régularisation: 0,
	}) as MonthState[]
}

export const reevaluateRéductionGénéraleMoisParMois = (
	data: MonthState[],
	engine: Engine<DottedName>,
	régularisationMethod: RégularisationMethod
): MonthState[] => {
	const SMICMensuel = engine.evaluate({
		valeur: 'salarié . temps de travail . SMIC',
		unité: 'heures/mois',
	}).nodeValue as number
	// Si on laisse l'engine calculer T dans le calcul de la réduction générale,
	// le résultat ne sera pas bon à cause de l'assiette de cotisations du contexte
	const coefT = engine.evaluate({
		valeur: 'salarié . cotisations . exonérations . T',
	}).nodeValue as number

	const reevaluatedData = data.reduce(
		(reevaluatedData: MonthState[], monthState: MonthState, index) => {
			const rémunérationBrute = monthState.rémunérationBrute
			let réductionGénérale = 0
			let régularisation = 0

			const partialData = [
				...reevaluatedData,
				{
					rémunérationBrute,
					réductionGénérale,
					régularisation,
				},
			]

			if (régularisationMethod === 'progressive') {
				régularisation = getRégularisationProgressive(
					index,
					partialData,
					SMICMensuel,
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
					rémunérationBrute
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
	const currentRéductionGénéraleAnnuelle =
		réductionGénéraleDernierMois +
		sumAll(data.map((monthData) => monthData.réductionGénérale))
	const realRéductionGénéraleAnnuelle = engine.evaluate({
		valeur: réductionGénéraleDottedName,
		arrondi: 'non',
		unité: '€/an',
	}).nodeValue as number

	return realRéductionGénéraleAnnuelle - currentRéductionGénéraleAnnuelle
}

// La régularisation progressive du mois N est la différence entre la réduction générale
// calculée pour la rémunération totale jusqu'à N (comparée au SMIC mensuel * N) et la
// somme des N-1 réductions générales déjà accordées (en incluant les régularisations).
const getRégularisationProgressive = (
	monthIndex: number,
	data: MonthState[],
	SMICMensuel: number,
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

	const SMICCumulé = nbOfMonths * SMICMensuel

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
