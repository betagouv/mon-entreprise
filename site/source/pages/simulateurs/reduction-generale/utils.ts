import { DottedName } from 'modele-social'
import Engine from 'publicodes'

import { MonthState } from './RéductionGénérale'

// TODO: remplacer "salarié . cotisations . assiette" par "salarié . rémunération . brut"
// lorsqu'elle n'incluera plus les frais professionnels.
const rémunérationBruteDottedName = 'salarié . cotisations . assiette'

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

export const getInitialRéductionGénéraleMensuelle = (
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
