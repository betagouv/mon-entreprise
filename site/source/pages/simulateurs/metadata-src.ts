import { ImmutableType } from '@/types/utils'

import { choixStatutJuridiqueConfig } from '../assistants/choix-du-statut/choix-statut-juridique/config'
import { déclarationChargesSocialesIndépendantConfig } from '../assistants/declaration-charges-sociales-independant/config'
import { déclarationRevenuIndépendantBetaConfig } from '../assistants/declaration-revenu-independants/config'
import { demandeMobilitéConfig } from '../assistants/demande-mobilité/config'
import { économieCollaborativeConfig } from '../assistants/économie-collaborative/config'
import { pourMonEntrepriseConfig } from '../assistants/pour-mon-entreprise/config'
import { rechercheCodeApeConfig } from '../assistants/recherche-code-ape/config'
import { PageConfig, SimulatorsDataParams } from './_configs/types'
import { artisteAuteurConfig } from './artiste-auteur/config'
import { autoEntrepreneurConfig } from './auto-entrepreneur/config'
import { auxiliaireMédicalConfig } from './auxiliaire-médical/config'
import { avocatConfig } from './avocat/config'
import { chirurgienDentisteConfig } from './chirurgien-dentiste/config'
import { chômagePartielConfig } from './chômage-partiel/config'
import { cipavConfig } from './cipav/config'
import { comparaisonStatutsConfig } from './comparaison-statuts/config'
import { coûtCréationEntrepriseConfig } from './cout-creation-entreprise/config.js'
import { dividendesConfig } from './dividendes/config'
import { eirlConfig } from './eirl/config'
import { entrepriseIndividuelleConfig } from './entreprise-individuelle/config'
import { eurlConfig } from './eurl/config'
import { expertComptableConfig } from './expert-comptable/config'
import { impôtSociétéConfig } from './impot-societe/config'
import { indépendantConfig } from './indépendant/config'
import { médecinConfig } from './médecin/config'
import { pamcConfig } from './pamc/config'
import { pharmacienConfig } from './pharmacien/config'
import { professionLibéraleConfig } from './profession-libérale/config'
import { sageFemmeConfig } from './sage-femme/config'
import { salariéConfig } from './salarié/config'
import { sasuConfig } from './sasu/config'

/**
 * Contient l'intégralité des données concernant les différents simulateurs et assistants
 * sans dépendance qui compliquerait leur import dans le script de mise à jour
 * des données pour Algolia.
 */
const getMetadataSrc = (params: SimulatorsDataParams) => {
	const data = {
		// simulateurs:
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
		...coûtCréationEntrepriseConfig(params),
		...impôtSociétéConfig(params),
		...cipavConfig(params),

		// assistants:
		...choixStatutJuridiqueConfig(params),
		...déclarationChargesSocialesIndépendantConfig(params),
		...déclarationRevenuIndépendantBetaConfig(params),
		...demandeMobilitéConfig(params),
		...pourMonEntrepriseConfig(params),
		...rechercheCodeApeConfig(params),
	} as const

	return data satisfies ImmutableType<Record<string, PageConfig>>
}

export type MetadataSrc = ReturnType<typeof getMetadataSrc>
export default getMetadataSrc
