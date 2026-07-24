import type { TFunction } from 'i18next'
import { PublicodesExpression } from 'publicodes'

import { TrackingChapters } from '@/components/PianoAnalytics/TrackingChaptersContext'
import { AbsoluteSitePaths } from '@/sitePaths'
import { ImmutableType } from '@/types/utils'

/**
 * Métadonnées d'une page de simulateur ou d'assistant : uniquement des
 * données pures (textes, chemins, drapeaux), sans composant React ni
 * ressource de la page. C'est la seule partie agrégée pour les besoins
 * transverses : plan du site, recherche, cards, statistiques, Algolia.
 */
export interface PageMetadata {
	/** Identifiant unique de la page
	 */
	id: string

	/** Chemin de la page
	 *  Ce dernier doit exister dans le fichier sitePaths.ts */
	path: string

	/** Chemin de l'iframe */
	iframePath: string

	/** Le chemin dans l'objet `absoluteSitePath`
	 * @example 'simulateurs.salarié'
	 */
	pathId: string

	/** Icône de la page (emoji) */
	icône: string

	/** Nom court du simulateur
	 *
	 * Il sera utilisé dans la carte générée par le composant `SimulateurCard`
	 *  */
	shortName: string

	/** Titre H1 de la page du simulateur */
	title: string

	/**
	 * Les informations liées au tracking, utilisées pour les statistiques.
	 *
	 * Exemples :
	 * {
	 * 		chapter1: 'simulateurs'
	 * 		chapter2: 'auto_entrepreneur'
	 * }
	 * {
	 * 		chapter1: 'assistant'
	 * 		chapter2: 'choix_du_statut'
	 * }
	 * {
	 * 		chapter1: 'simulateurs'
	 * 		chapter2: 'profession_liberale'
	 * 		chapter3: 'sage_femme'
	 * }
	 */
	tracking: TrackingChapters

	/** Métadonnées textuelles de la page pour les moteurs de recherche */
	meta: {
		/** Titre de la page pour les moteurs de recherche */
		title: string
		/** Description de la page pour les moteurs de recherche */
		description: string
	}

	/** Indique si le simulateur est privé
	 *
	 * Si c'est le cas, il n'apparaîtra pas dans la recherche et ne sera
	 * pas référencé dans les stats ou dans la page d'intégration
	 */
	private?: boolean

	/** Indique si le simulateur doit être masqué des menus et listes
	 *
	 * Le simulateur reste accessible par son URL directe
	 */
	hidden?: boolean

	/** Indique si la page est en version bêta (affiche un petit bandeau) */
	beta?: boolean

	/** Texte d'information */
	tooltip?: string

	/**
	 * Indique les catégories d'entreprise concernées par le simulateur.
	 * Un tableau vide indique que le simulateur concerne toutes les catégories d'entreprise.
	 */
	codesCatégorieJuridique?: string[]
}

export type ConditionalExternalLink = ExternalLink & {
	associatedRule: PublicodesExpression
}

export type ExternalLink = {
	url: string
	title: string
	description?: string
	logo?: string
	ctaLabel?: string
	ariaLabel?: string
}

export interface PageMetadataParams {
	t: TFunction
	sitePaths: AbsoluteSitePaths
	language: string
}

export function parId<Base extends ImmutableType<PageMetadata>>(
	base: ImmutableType<PageMetadata> & Base
) {
	return {
		[base.id]: base,
	} as ImmutableType<{ [k in Base['id']]: Base }>
}
