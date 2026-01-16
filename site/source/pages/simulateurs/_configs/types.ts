import type { TFunction } from 'i18next'
import { PublicodesExpression } from 'publicodes'

import { TrackingChapters } from '@/components/ATInternetTracking'
import { SimulationConfig } from '@/domaine/SimulationConfig'
import { AbsoluteSitePaths } from '@/sitePaths'

/**
 * Configuration d'une page de simulateur ou d'assistant
 */
export interface PageConfig {
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

	/** Configuration du tracking */

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

	/** Métadonnées de la page */
	meta: {
		/** Titre de la page pour les moteurs de recherche */
		title: string
		/** Description de la page pour les moteurs de recherche */
		description: string
		/** Description Open Graph de la page */
		ogDescription?: string
		/** Titre Open Graph de la page */
		ogTitle?: string
		/** Image Open Graph de la page */
		ogImage?: string
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
	 * Avertissement propre au simulateur à ajouter dans l’encart générique
	 */
	warning?: () => JSX.Element

	/** ID des pages de simulateur ou assistant à faire apparaître dans la
	 * section « Ressources utiles » en bas de page.
	 */
	nextSteps?: string[] | false

	/** Liens externes à faire apparaître dans la section « Ressources utiles » en bas de page. */
	externalLinks?: ExternalLink[]

	/**
	 * Liens externes à faire apparaître dans la section « Ressources utiles » en bas de page,
	 * associés à une règle Publicode qui conditionne leur affichage.
	 */
	conditionalExternalLinks?: ConditionalExternalLink[]

	/** Configuration de la simulation */
	simulation?: SimulationConfig

	/**
	 * Indique si la dernière simulation doit être chargée automatiquement à l'arrivée
	 * sur la page
	 */
	autoloadLastSimulation?: boolean

	/**
	 * Indique les catégories d'entreprise concernées par le simulateur.
	 * Un tableau vide indique que le simulateur concerne toutes les catégories d'entreprise.
	 */
	codesCatégorieJuridique?: string[]

	/**
	 * Indique si la date du simulateur doit être masquée ou pas.
	 */
	hideDate?: boolean

	/**
	 * Indique si le formulaire de retour doit être désactivé en iframe
	 */
	disableIframeFeedback?: boolean

	/**
	 * Composant React de la page
	 * Note : Le nom du composant doit être en un seul mot pour que le script `yarn build:simulator-data` marche
	 * example: `component: MyComponent,`
	 */
	component?: () => JSX.Element

	/** Composant React pour les explications SEO, qui apparaissent en dessous du simulateur */
	seoExplanations?: () => JSX.Element
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

export interface SimulatorsDataParams {
	t: TFunction
	sitePaths: AbsoluteSitePaths
	language: string
}
