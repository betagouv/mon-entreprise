import i18next from 'i18next'
import rules, { DottedName } from 'modele-social'
import Engine, { PublicodesExpression, Unit } from 'publicodes'

import { engineFactory } from '@/components/utils/EngineContext'
import { Situation } from '@/domaine/Situation'
import ruleTranslations from '@/locales/rules-en.yaml'
import translateRules from '@/locales/translateRules'

let publicodesEngine: Engine | null = null

export function getPublicodesEngine(): Engine<DottedName> {
	if (!publicodesEngine) {
		resetPublicodesEngine()
	}

	return publicodesEngine as Engine<DottedName>
}

export function resetPublicodesEngine(): void {
	publicodesEngine = engineFactory(
		i18next.language === 'en'
			? translateRules('en', ruleTranslations, rules)
			: rules
	)
}

export const evalueAvecPublicodes = <TypeRetour>(
	situation: Situation,
	règle: PublicodesExpression,
	unité?: Unit
) =>
	getPublicodesEngine()
		.setSituation(situation)
		.evaluate(unité ? { valeur: règle, unité } : règle).nodeValue as TypeRetour
