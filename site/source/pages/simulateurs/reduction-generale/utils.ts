import { DottedName } from 'modele-social'
import Engine from 'publicodes'

// TODO: remplacer "salarié . cotisations . assiette" par "salarié . rémunération . brut"
// lorsqu'elle n'incluera plus les frais professionnels.
export const rémunérationBruteDottedName = 'salarié . cotisations . assiette'

export type MonthState = {
	rémunérationBrute: number
	réductionGénérale: number
}

export const getRéductionGénéraleFromRémunération = (
	engine: Engine<DottedName>,
	rémunérationBrute: number
): number => {
	const réductionGénérale = engine.evaluate({
		valeur: 'salarié . cotisations . exonérations . réduction générale',
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
	}) as MonthState[]
}

export const reevaluateRéductionGénéraleMoisParMois = (
	data: MonthState[],
	engine: Engine<DottedName>
): MonthState[] => {
	return data.map((item) => ({
		...item,
		réductionGénérale: getRéductionGénéraleFromRémunération(
			engine,
			item.rémunérationBrute
		),
	}))
}
