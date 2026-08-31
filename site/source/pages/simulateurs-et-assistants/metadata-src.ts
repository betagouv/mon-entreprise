import { choixDuStatutMetadata } from '@/pages/assistants/choix-du-statut/metadata'
import { pourMonEntrepriseMetadata } from '@/pages/assistants/pour-mon-entreprise/metadata'
import { rechercheCodeApeMetadata } from '@/pages/assistants/recherche-code-ape/metadata'
import {
	PageMetadata,
	PageMetadataParams,
	parId,
} from '@/pages/simulateurs/_configs/types'
import { activitéPartielleMetadata } from '@/pages/simulateurs/activité-partielle/metadata'
import { artisteAuteurMetadata } from '@/pages/simulateurs/artiste-auteur/metadata'
import { autoEntrepreneurMetadata } from '@/pages/simulateurs/auto-entrepreneur/metadata'
import { auxiliaireMédicalMetadata } from '@/pages/simulateurs/auxiliaire-médical/metadata'
import { avocatMetadata } from '@/pages/simulateurs/avocat/metadata'
import { cessationActivitéMetadata } from '@/pages/simulateurs/cessation-activité/metadata'
import { chirurgienDentisteMetadata } from '@/pages/simulateurs/chirurgien-dentiste/metadata'
import { cipavMetadata } from '@/pages/simulateurs/cipav/metadata'
import { comparaisonStatutsMetadata } from '@/pages/simulateurs/comparaison-statuts/metadata'
import { cotisationMaladieFrontalierSuisseMetadata } from '@/pages/simulateurs/cotisation-maladie-frontalier-suisse/metadata'
import { coûtCréationEntrepriseMetadata } from '@/pages/simulateurs/cout-creation-entreprise/metadata'
import { dividendesMetadata } from '@/pages/simulateurs/dividendes/metadata'
import { eirlMetadata } from '@/pages/simulateurs/eirl/metadata'
import { entrepriseIndividuelleMetadata } from '@/pages/simulateurs/entreprise-individuelle/metadata'
import { eurlMetadata } from '@/pages/simulateurs/eurl/metadata'
import { expertComptableMetadata } from '@/pages/simulateurs/expert-comptable/metadata'
import { impôtSociétéMetadata } from '@/pages/simulateurs/impot-societe/metadata'
import { indépendantMetadata } from '@/pages/simulateurs/indépendant/metadata'
import { locationDeMeubleMetadata } from '@/pages/simulateurs/location-de-meublé/metadata'
import { lodeomMetadata } from '@/pages/simulateurs/lodeom/metadata'
import { médecinMetadata } from '@/pages/simulateurs/médecin/metadata'
import { pamcMetadata } from '@/pages/simulateurs/pamc/metadata'
import { pharmacienMetadata } from '@/pages/simulateurs/pharmacien/metadata'
import { professionLibéraleMetadata } from '@/pages/simulateurs/profession-libérale/metadata'
import { sageFemmeMetadata } from '@/pages/simulateurs/sage-femme/metadata'
import { salariéMetadata } from '@/pages/simulateurs/salarié/metadata'
import { sasuMetadata } from '@/pages/simulateurs/sasu/metadata'
import { ImmutableType } from '@/types/utils'

/**
 * Contient les métadonnées (données pures, sans composant React) de tous les
 * simulateurs et assistants utilisées pour : plan du site, recherche, cards, statistiques,
 * script de mise à jour des données pour Algolia…
 */
const getMetadataSrc = (params: PageMetadataParams) => {
	return {
		// simulateurs :
		...parId(salariéMetadata(params)),
		...parId(entrepriseIndividuelleMetadata(params)),
		...parId(eirlMetadata(params)),
		...parId(sasuMetadata(params)),
		...parId(eurlMetadata(params)),
		...parId(autoEntrepreneurMetadata(params)),
		...parId(indépendantMetadata(params)),
		...parId(artisteAuteurMetadata(params)),
		...parId(activitéPartielleMetadata(params)),
		...parId(comparaisonStatutsMetadata(params)),
		...parId(pharmacienMetadata(params)),
		...parId(médecinMetadata(params)),
		...parId(chirurgienDentisteMetadata(params)),
		...parId(sageFemmeMetadata(params)),
		...parId(auxiliaireMédicalMetadata(params)),
		...parId(avocatMetadata(params)),
		...parId(expertComptableMetadata(params)),
		...parId(professionLibéraleMetadata(params)),
		...parId(pamcMetadata(params)),
		...parId(dividendesMetadata(params)),
		...parId(coûtCréationEntrepriseMetadata(params)),
		...parId(impôtSociétéMetadata(params)),
		...parId(cipavMetadata(params)),
		...parId(lodeomMetadata(params)),
		...parId(cessationActivitéMetadata(params)),
		...parId(locationDeMeubleMetadata(params)),
		...parId(cotisationMaladieFrontalierSuisseMetadata(params)),

		// assistants :
		...parId(choixDuStatutMetadata(params)),
		...parId(pourMonEntrepriseMetadata(params)),
		...parId(rechercheCodeApeMetadata(params)),
	} as const satisfies ImmutableType<Record<string, PageMetadata>>
}

export type SimulatorsMetadata = ReturnType<typeof getMetadataSrc>
export type SimulatorMetadata = SimulatorsMetadata[keyof SimulatorsMetadata]

export default getMetadataSrc
