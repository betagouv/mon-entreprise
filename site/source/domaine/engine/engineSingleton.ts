import i18next from 'i18next'
import rules, { RègleModeleSocial } from 'modele-social'
import Engine, { PublicodesExpression, Unit } from 'publicodes'

import { engineFactory } from '@/components/utils/EngineContext'
import { SituationPublicodes } from '@/domaine/SituationPublicodes'
import ruleTranslations from '@/locales/rules-en.yaml'
import translateRules from '@/locales/translateRules'

let publicodesEngine: Engine | null = null

function getPublicodesEngine(): Engine<RègleModeleSocial> {
	if (!publicodesEngine) {
		resetPublicodesEngine()
	}

	return publicodesEngine as Engine<RègleModeleSocial>
}

function resetPublicodesEngine(): void {
	publicodesEngine = engineFactory(
		i18next.language === 'en'
			? translateRules('en', ruleTranslations, rules)
			: rules
	)
}

export const evalueAvecPublicodes = <TypeRetour>(
	situation: SituationPublicodes,
	règle: PublicodesExpression,
	unité?: Unit
) =>
	getPublicodesEngine()
		.setSituation(situation)
		.evaluate(unité ? { valeur: règle, unité } : règle).nodeValue as TypeRetour
