// Currenty we systematically bundle all the rules even if we only need a
// sub-section of them. We might support "code-splitting" the rules in the
// future.
import { Rules as GenericRules } from 'Engine/types'
import jsonRules from './dottednames.json'
import artisteAuteur from './rules/artiste-auteur.yaml'
import base from './rules/base.yaml'
import chômagePartiel from './rules/chômage-partiel.yaml'
import CCBatiment from './rules/conventions-collectives/bâtiment.yaml'
import CCHotels from './rules/conventions-collectives/hôtels-cafés-restaurants.yaml'
import CCOptique from './rules/conventions-collectives/optique.yaml'
import CCSpectacleVivant from './rules/conventions-collectives/spectacle-vivant.yaml'
import CCSport from './rules/conventions-collectives/sport.yaml'
import dirigeant from './rules/dirigeant.yaml'
import déclarationIndépendant from './rules/déclaration-revenu-indépendant.yaml'
import entrepriseEtablissement from './rules/entreprise-établissement.yaml'
import impot from './rules/impôt.yaml'
import protectionSociale from './rules/protection-sociale.yaml'
import salarié from './rules/salarié.yaml'
import situationPersonnelle from './rules/situation-personnelle.yaml'

export type DottedName = keyof typeof jsonRules
export type Rules = GenericRules<DottedName>

const rules: Rules = {
	...base,
	// TODO: rule order shouldn't matter but there is a bug if "impot" is after
	// "dirigeant".
	...impot,
	...déclarationIndépendant,
	...artisteAuteur,
	...dirigeant,
	...entrepriseEtablissement,
	...protectionSociale,
	...salarié,
	...CCBatiment,
	...CCHotels,
	...CCOptique,
	...CCSpectacleVivant,
	...CCSport,
	...situationPersonnelle,
	...chômagePartiel
}

export default rules
