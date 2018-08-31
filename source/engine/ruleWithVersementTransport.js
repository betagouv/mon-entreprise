import rawRules from 'Règles/base.yaml'
import translations from 'Règles/externalized.yaml'
// TODO - should be in UI, not engine
import taux_versement_transport from 'Règles/taux-versement-transport.json'
import { enrichRule, translateAll } from './rules'

// On enrichit la base de règles avec des propriétés dérivées de celles du YAML
export let rules = translateAll(translations, rawRules).map(rule =>
	enrichRule(rule, { taux_versement_transport })
)
export let rulesFr = rawRules.map(rule =>
	enrichRule(rule, { taux_versement_transport })
)
