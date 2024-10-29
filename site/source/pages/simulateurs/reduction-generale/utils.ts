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
	const réductionGénérale = getRéductionGénéraleFromRémunération(
		engine,
		rémunérationBrute
	)

	return Array(12).fill({
		rémunérationBrute,
		réductionGénérale,
		régularisation: 0,
	}) as MonthState[]
}

export const reevaluateRéductionGénéraleMoisParMois = (
	data: MonthState[],
	engine: Engine<DottedName>
): MonthState[] => {
	const reevaluatedData = data.map((item) => ({
		...item,
		réductionGénérale: getRéductionGénéraleFromRémunération(
			engine,
			item.rémunérationBrute
		),
		régularisation: 0,
	}))

	reevaluatedData[reevaluatedData.length - 1].régularisation =
		getRégularisationAnnuelle(data, engine)

	return reevaluatedData
}

const getRégularisationAnnuelle = (
	data: MonthState[],
	engine: Engine<DottedName>
): number => {
	const currentRéductionGénéraleAnnuelle = sumAll(
		data.map((monthData) => monthData.réductionGénérale)
	)
	const realRéductionGénéraleAnnuelle = engine.evaluate({
		valeur: réductionGénéraleDottedName,
		arrondi: 'non',
		unité: '€/an',
	}).nodeValue as number

	return realRéductionGénéraleAnnuelle - currentRéductionGénéraleAnnuelle
}

export const getRégularisationProgressive = (
	monthIndex: number,
	data: MonthState[],
	engine: Engine<DottedName>
): number => {
	if (monthIndex > data.length - 1) {
		return 0
	}

	const nbOfMonths = monthIndex + 1
	const partialData = data.slice(0, nbOfMonths)
	const currentRéductionGénéraleTotale = sumAll(
		partialData.map((monthData) => monthData.réductionGénérale)
	)
	const rémunérationBruteTotale = sumAll(
		partialData.map((monthData) => monthData.rémunérationBrute)
	)
	const SMICMensuel = engine.evaluate({
		valeur: 'salarié . temps de travail . SMIC',
		unité: 'heures/mois',
	}).nodeValue as number

	// Si on laisse l'engine calculer T dans le calcul de la réduction générale,
	// le résultat ne sera pas bon à cause de l'assiette de cotisations du contexte
	const coefT = engine.evaluate({
		valeur: 'salarié . cotisations . exonérations . T' ,
	}).nodeValue as number

	const realRéductionGénéraleTotale = engine.evaluate({
		valeur: réductionGénéraleDottedName,
		arrondi: 'non',
		contexte: {
			[rémunérationBruteDottedName]: rémunérationBruteTotale,
			'salarié . temps de travail . SMIC': nbOfMonths * SMICMensuel,
			'salarié . cotisations . exonérations . T': coefT,
		}
	}).nodeValue as number

	return realRéductionGénéraleTotale - currentRéductionGénéraleTotale
}
