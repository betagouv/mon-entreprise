import { enrichRule, hasKnownRuleType, translateAll } from 'Engine/rules'
import rawRules from 'Règles/base.yaml'
import translations from 'Règles/externalized.yaml'
// TODO - should be in UI, not engine
import taux_versement_transport from 'Règles/taux-versement-transport.json'
// On enrichit la base de règles avec des propriétés dérivées de celles du YAML
export let rules = translateAll(translations, rawRules).map(rule =>
	enrichRule(rule, { taux_versement_transport })
)
export let rulesFr = rawRules.map(rule =>
	enrichRule(rule, { taux_versement_transport })
)
export let searchRules = searchInput =>
	rules
		.filter(
			rule =>
				rule &&
				hasKnownRuleType(rule) &&
				JSON.stringify(rule)
					.toLowerCase()
					.indexOf(searchInput) > -1
		)
		.map(enrichRule)
