// Currenty we systematically bundle all the rules even if we only need a
// sub-section of them. We might support "code-splitting" the rules in the
// future.

import artisteAuteur from './rules/artiste-auteur.yaml'
import base from './rules/base.yaml'
import conventionsCollectives from './rules/conventions-collectives.yaml'
import dirigeant from './rules/dirigeant.yaml'
import déclarationIndépendant from './rules/déclaration-revenu-indépendant.yaml'
import entrepriseEtablissement from './rules/entreprise-établissement.yaml'
import impot from './rules/impôt.yaml'
import protectionSociale from './rules/protection-sociale.yaml'
import salarié from './rules/salarié.yaml'
import situationPersonnelle from './rules/situation-personnelle.yaml'

const rules = {
	...base,
	// TODO: rule order shouldn't matter but there is a bug if "impot" is after
	// "dirigeant".
	...impot,
	...artisteAuteur,
	...dirigeant,
	...entrepriseEtablissement,
	...protectionSociale,
	...salarié,
	...conventionsCollectives,
	...situationPersonnelle,
	...déclarationIndépendant
}

export default rules
