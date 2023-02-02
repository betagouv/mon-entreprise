import { ImmutableType } from '@/types/utils'

import { artisteAuteurConfig } from './artiste-auteur/_config'
import { autoEntrepreneurConfig } from './auto-entrepreneur/_config'
import { auxiliaireMédicalConfig } from './auxiliaire-médical/_config'
import { avocatConfig } from './avocat/_config'
import { chirurgienDentisteConfig } from './chirurgien-dentiste/_config'
import { choixStatutConfig } from './choix-statut/_config'
import { chômagePartielConfig } from './chômage-partiel/_config'
import { comparaisonStatutsConfig } from './comparaison-statuts/_config'
import { PageConfig, SimulatorsDataParams } from './configs/types'
import { coûtCréationEntrepriseConfig } from './cout-creation-entreprise/_config.js'
import { demandeMobilitéConfig } from './demande-mobilité/_config'
import { dividendesConfig } from './dividendes/_config'
import { déclarationChargesSocialesIndépendantConfig } from './déclaration-charges-sociales-indépendant/_config'
import { déclarationRevenuIndépendantBetaConfig } from './déclaration-revenu-indépendant-beta/_config'
import { déclarationRevenuIndépendantConfig } from './déclaration-revenu-indépendant/_config'
import { eirlConfig } from './eirl/_config'
import { entrepriseIndividuelleConfig } from './entreprise-individuelle/_config'
import { eurlConfig } from './eurl/_config'
import { exonérationCovidConfig } from './exonération-covid/_config'
import { expertComptableConfig } from './expert-comptable/_config'
import { impôtSociétéConfig } from './impot-societe/_config'
import { indépendantConfig } from './indépendant/_config'
import { médecinConfig } from './médecin/_config'
import { pamcConfig } from './pamc/_config'
import { pharmacienConfig } from './pharmacien/_config'
import { professionLibéraleConfig } from './profession-libérale/_config'
import { sageFemmeConfig } from './sage-femme/_config'
import { salariéConfig } from './salarié/_config'
import { sasuConfig } from './sasu/_config'
import { économieCollaborativeConfig } from './économie-collaborative/_config'

/**
 * Contient l'intégralité des données concernant les différents simulateurs
 * sans dépendance qui compliquerait leur import dans le script de mise à jour
 * des données pour Algolia.
 */
const getMetadataSrc = (params: SimulatorsDataParams) => {
	const data = {
		...salariéConfig(params),
		...entrepriseIndividuelleConfig(params),
		...eirlConfig(params),
		...sasuConfig(params),
		...eurlConfig(params),
		...autoEntrepreneurConfig(params),
		...indépendantConfig(params),
		...artisteAuteurConfig(params),
		...chômagePartielConfig(params),
		...comparaisonStatutsConfig(params),
		...économieCollaborativeConfig(params),
		...choixStatutConfig(params),
		...déclarationChargesSocialesIndépendantConfig(params),
		// TODO: Delete "déclaration-revenu-indépendant" object when DRI will no longer be in beta
		...déclarationRevenuIndépendantConfig(params),
		...déclarationRevenuIndépendantBetaConfig(params),
		...demandeMobilitéConfig(params),
		...pharmacienConfig(params),
		...médecinConfig(params),
		...chirurgienDentisteConfig(params),
		...sageFemmeConfig(params),
		...auxiliaireMédicalConfig(params),
		...avocatConfig(params),
		...expertComptableConfig(params),
		...professionLibéraleConfig(params),
		...pamcConfig(params),
		...dividendesConfig(params),
		...exonérationCovidConfig(params),
		...coûtCréationEntrepriseConfig(params),
		...impôtSociétéConfig(params),
	} as const

	return data satisfies ImmutableType<Record<string, PageConfig>>
}

export type MetadataSrc = ReturnType<typeof getMetadataSrc>
export default getMetadataSrc
