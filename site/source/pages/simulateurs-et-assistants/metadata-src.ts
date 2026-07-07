import { choixStatutJuridiqueConfig } from '@/pages/assistants/choix-du-statut/config'
import { CMGConfig } from '@/pages/assistants/cmg/config'
import { pourMonEntrepriseConfig } from '@/pages/assistants/pour-mon-entreprise/config'
import { rechercheCodeApeConfig } from '@/pages/assistants/recherche-code-ape/config'
import {
	PageConfig,
	SimulatorsDataParams,
} from '@/pages/simulateurs/_configs/types'
import { activitéPartielleConfig } from '@/pages/simulateurs/activite-partielle/config'
import { artisteAuteurConfig } from '@/pages/simulateurs/artiste-auteur/config'
import { autoEntrepreneurConfig } from '@/pages/simulateurs/auto-entrepreneur/config'
import { auxiliaireMédicalConfig } from '@/pages/simulateurs/auxiliaire-medical/config'
import { avocatConfig } from '@/pages/simulateurs/avocat/config'
import { cessationActivitéConfig } from '@/pages/simulateurs/cessation-activite/config'
import { chirurgienDentisteConfig } from '@/pages/simulateurs/chirurgien-dentiste/config'
import { cipavConfig } from '@/pages/simulateurs/cipav/config'
import { comparaisonStatutsConfig } from '@/pages/simulateurs/comparaison-statuts/config'
import { coûtCréationEntrepriseConfig } from '@/pages/simulateurs/cout-creation-entreprise/config'
import { dividendesConfig } from '@/pages/simulateurs/dividendes/config'
import { eirlConfig } from '@/pages/simulateurs/eirl/config'
import { entrepriseIndividuelleConfig } from '@/pages/simulateurs/entreprise-individuelle/config'
import { eurlConfig } from '@/pages/simulateurs/eurl/config'
import { expertComptableConfig } from '@/pages/simulateurs/expert-comptable/config'
import { impôtSociétéConfig } from '@/pages/simulateurs/impot-societe/config'
import { independantConfig } from '@/pages/simulateurs/independant/config'
import { locationDeMeubleConfig } from '@/pages/simulateurs/location-de-meuble/config'
import { lodeomConfig } from '@/pages/simulateurs/lodeom/config'
import { medecinConfig } from '@/pages/simulateurs/medecin/config'
import { pamcConfig } from '@/pages/simulateurs/pamc/config'
import { pharmacienConfig } from '@/pages/simulateurs/pharmacien/config'
import { professionLibéraleConfig } from '@/pages/simulateurs/profession-liberale/config'
import { sageFemmeConfig } from '@/pages/simulateurs/sage-femme/config'
import { salarieConfig } from '@/pages/simulateurs/salarie/config'
import { sasuConfig } from '@/pages/simulateurs/sasu/config'
import { ImmutableType } from '@/types/utils'

/**
 * Contient l'intégralité des données concernant les différents simulateurs et assistants
 * sans dépendance qui compliquerait leur import dans le script de mise à jour
 * des données pour Algolia.
 */
const getMetadataSrc = (params: SimulatorsDataParams) => {
	return {
		// simulateurs:
		...salarieConfig(params),
		...entrepriseIndividuelleConfig(params),
		...eirlConfig(params),
		...sasuConfig(params),
		...eurlConfig(params),
		...autoEntrepreneurConfig(params),
		...independantConfig(params),
		...artisteAuteurConfig(params),
		...activitéPartielleConfig(params),
		...comparaisonStatutsConfig(params),
		...pharmacienConfig(params),
		...medecinConfig(params),
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
		...lodeomConfig(params),
		...cessationActivitéConfig(params),
		...locationDeMeubleConfig(params),

		// assistants:
		...choixStatutJuridiqueConfig(params),
		...CMGConfig(params),
		...pourMonEntrepriseConfig(params),
		...rechercheCodeApeConfig(params),
	} as const satisfies ImmutableType<Record<string, PageConfig>>
}

export type SimulatorData = ReturnType<typeof getMetadataSrc>
export type SimulatorDataValues = SimulatorData[keyof SimulatorData]

export default getMetadataSrc
