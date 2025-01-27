import { ImmutableType } from '@/types/utils'

import { choixStatutJuridiqueConfig } from '../assistants/choix-du-statut/config'
import { déclarationChargesSocialesIndépendantConfig } from '../assistants/declaration-charges-sociales-independant/config'
import { déclarationRevenusPAMCConfig } from '../assistants/declaration-revenus-pamc/config'
import { demandeMobilitéConfig } from '../assistants/demande-mobilité/config'
import { pourMonEntrepriseConfig } from '../assistants/pour-mon-entreprise/config'
import { rechercheCodeApeConfig } from '../assistants/recherche-code-ape/config'
import { PageConfig, SimulatorsDataParams } from '../simulateurs/_configs/types'
import { artisteAuteurConfig } from '../simulateurs/artiste-auteur/config'
import { autoEntrepreneurConfig } from '../simulateurs/auto-entrepreneur/config'
import { auxiliaireMédicalConfig } from '../simulateurs/auxiliaire-médical/config'
import { avocatConfig } from '../simulateurs/avocat/config'
import { cessationActivitéConfig } from '../simulateurs/cessation-activité/config'
import { chirurgienDentisteConfig } from '../simulateurs/chirurgien-dentiste/config'
import { chômagePartielConfig } from '../simulateurs/chômage-partiel/config'
import { cipavConfig } from '../simulateurs/cipav/config'
import { comparaisonStatutsConfig } from '../simulateurs/comparaison-statuts/config'
import { coûtCréationEntrepriseConfig } from '../simulateurs/cout-creation-entreprise/config.js'
import { dividendesConfig } from '../simulateurs/dividendes/config'
import { eirlConfig } from '../simulateurs/eirl/config'
import { entrepriseIndividuelleConfig } from '../simulateurs/entreprise-individuelle/config'
import { eurlConfig } from '../simulateurs/eurl/config'
import { expertComptableConfig } from '../simulateurs/expert-comptable/config'
import { impôtSociétéConfig } from '../simulateurs/impot-societe/config'
import { indépendantConfig } from '../simulateurs/indépendant/config'
import { lodeomConfig } from '../simulateurs/lodeom/config'
import { médecinConfig } from '../simulateurs/médecin/config'
import { pamcConfig } from '../simulateurs/pamc/config'
import { pharmacienConfig } from '../simulateurs/pharmacien/config'
import { professionLibéraleConfig } from '../simulateurs/profession-libérale/config'
import { réductionGénéraleConfig } from '../simulateurs/reduction-generale/config'
import { sageFemmeConfig } from '../simulateurs/sage-femme/config'
import { salariéConfig } from '../simulateurs/salarié/config'
import { sasuConfig } from '../simulateurs/sasu/config'

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
		...réductionGénéraleConfig(params),
		...lodeomConfig(params),
		...cessationActivitéConfig(params),

		// assistants:
		...choixStatutJuridiqueConfig(params),
		...déclarationChargesSocialesIndépendantConfig(params),
		...déclarationRevenusPAMCConfig(params),
		...demandeMobilitéConfig(params),
		...pourMonEntrepriseConfig(params),
		...rechercheCodeApeConfig(params),
	} as const

	return data satisfies ImmutableType<Record<string, PageConfig>>
}

export type MetadataSrc = ReturnType<typeof getMetadataSrc>
export default getMetadataSrc
