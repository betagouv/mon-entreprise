// Currenty we systematically bundle all the rules even if we only need a
// sub-section of them. We might support "code-splitting" the rules in the
// future.
import {
	EvaluatedRule as GenericEvaluatedRule,
	ParsedRule as GenericParsedRule,
	ParsedRules as GenericParsedRules,
	Rules as GenericRules
} from 'publicodes'
import artisteAuteur from './artiste-auteur.yaml'
import base from './base.yaml'
import chômagePartiel from './chômage-partiel.yaml'
import CCBatiment from './conventions-collectives/bâtiment.yaml'
import CCCompta from './conventions-collectives/experts-comptables.yaml'
import CCHotels from './conventions-collectives/hôtels-cafés-restaurants.yaml'
import CCOptique from './conventions-collectives/optique.yaml'
import CCSpectacleVivant from './conventions-collectives/spectacle-vivant.yaml'
import CCSport from './conventions-collectives/sport.yaml'
import dirigeant from './dirigeant.yaml'
import jsonRules from '../types/dottednames.json'
import déclarationIndépendant from './déclaration-revenu-indépendant.yaml'
import professionLibérale from './profession-libérale.yaml'
import entrepriseEtablissement from './entreprise-établissement.yaml'
import impot from './impôt.yaml'
import protectionSociale from './protection-sociale.yaml'
import salarié from './salarié.yaml'
import situationPersonnelle from './situation-personnelle.yaml'

export type DottedName = keyof typeof jsonRules
export type Rules = GenericRules<DottedName>
export type ParsedRules = GenericParsedRules<DottedName>
export type ParsedRule = GenericParsedRule<DottedName>
export type EvaluatedRule = GenericEvaluatedRule<DottedName>
export type Situation = Partial<Record<DottedName, string>>

const rules: Rules = {
	...base,
	// TODO: rule order shouldn't matter but there is a bug if "impot" is after
	// "dirigeant".
	...impot,
	...déclarationIndépendant,
	...artisteAuteur,
	...dirigeant,
	...professionLibérale,
	...entrepriseEtablissement,
	...protectionSociale,
	...salarié,
	...CCBatiment,
	...CCHotels,
	...CCOptique,
	...CCSpectacleVivant,
	...CCSport,
	...CCCompta,
	...situationPersonnelle,
	...chômagePartiel
}

export default rules
