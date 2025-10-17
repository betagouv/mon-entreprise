import rules, { RègleModeleSocial } from 'modele-social'
import Engine, { PublicodesExpression, Unit } from 'publicodes'

import { SituationPublicodes } from '@/domaine/SituationPublicodes'
import { engineFactory } from '@/utils/publicodes/engineFactory'

let publicodesEngine: Engine | null = null

function getPublicodesEngine(): Engine<RègleModeleSocial> {
	if (!publicodesEngine) {
		resetPublicodesEngine()
	}

	return publicodesEngine as Engine<RègleModeleSocial>
}

function resetPublicodesEngine(): void {
	publicodesEngine = engineFactory(rules)
}

export const evalueAvecPublicodes = <TypeRetour>(
	situation: SituationPublicodes,
	règle: PublicodesExpression,
	unité?: Unit
) =>
	getPublicodesEngine()
		.setSituation(situation)
		.evaluate(unité ? { valeur: règle, unité } : règle).nodeValue as TypeRetour
