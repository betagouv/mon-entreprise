// Currenty we systematically bundle all the rules even if we only need a
// sub-section of them. We might support "code-splitting" the rules in the
// future.
import jsonRules from '../types/dottednames.json'
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
import déclarationIndépendant from './déclaration-revenu-indépendant.yaml'
import entrepriseEtablissement from './entreprise-établissement.yaml'
import impot from './impôt.yaml'
import professionLibérale from './profession-libérale.yaml'
import protectionSociale from './protection-sociale.yaml'
import salarié from './salarié.yaml'
import situationPersonnelle from './situation-personnelle.yaml'

export type DottedName = keyof typeof jsonRules

const rules = {
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
	...chômagePartiel,
}

export default rules
