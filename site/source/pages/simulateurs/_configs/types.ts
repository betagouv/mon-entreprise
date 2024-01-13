import type { TFunction } from 'i18next'
import { DottedName } from 'modele-social'
import { ASTNode, PublicodesExpression } from 'publicodes'

import { AbsoluteSitePaths } from '@/sitePaths'

export type Situation = Partial<
	Record<DottedName, PublicodesExpression | ASTNode>
>

/**
 * Configuration d'une page de simulateur ou d'assistant
 */
export interface PageConfig {
	/** Identifiant unique de la page
	 */
	id: string

	/** Chemin de la page
	 *  Ce dernier doit exister dans le fichier sitePaths.ts */
	path?: string

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
	tracking: Tracking

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

	/** Indique si la page est en version bêta (affiche un petit bandeau) */
	beta?: boolean

	/** Texte d'information */
	tooltip?: string

	/** ID des pages de simulateur ou assistant à faire apparaître dans la
	 * section « Ressources utiles » en bas de page.
	 */
	nextSteps?: string[] | false

	/** Configuration de la simulation */
	simulation?: SimulationConfig

	/** Indique si la dernière simulation doit être chargée automatiquement à l'arrivée
	 * sur la page
	 */
	autoloadLastSimulation?: boolean

	/** Composant React de la page
	 *
	 * Note : Le nom du composant doit être en un seul mot pour que le script `yarn build:simulator-data` marche
	 * example: `component: MyComponent,`
	 */
	component?: () => JSX.Element

	/** Composant React pour les explications SEO, qui apparaissent en dessous du simulateur */
	seoExplanations?: () => JSX.Element
}

export type SimulationConfig = Partial<{
	/**
	 * Objectifs exclusifs de la simulation : si une règle change dans la situation
	 * et qu'elle est dans `objectifs exclusifs`, alors toute les autres règles
	 * dans `objectifs exclusifs` seront supprimées de la situation
	 */
	'objectifs exclusifs': DottedName[]

	/**
	 * Objectifs de la simulation
	 */
	objectifs?: DottedName[]

	/**
	 * La situation de base du simulateur
	 */
	situation: Situation

	questions: {
		/**
		 * Question non prioritaires, elles aparraitront en fin de simulation
		 */
		'non prioritaires'?: DottedName[]

		/**
		 * Whitelist des questions qui sont affiché à l'utilisateur.
		 * Cela peut également servir pour prioriser des questions
		 * en mettant une string vide comme dernier élément
		 */
		liste?: (DottedName | '')[]

		/**
		 * Questions qui ne sont pas affiché à l'utilisateur
		 */
		'liste noire'?: DottedName[]

		/**
		 * Questions "raccourcis" sélectionnables en bas du simulateur
		 */
		"à l'affiche"?: {
			label: string
			dottedName: DottedName
		}[]
	}

	'unité par défaut'?: string
}>
/**
 * Les informations liées au tracking, utilisées pour les statistiques.
 *
 * Si seul une string est utilisée, alors elle équivaut à { chapter1: 'simulateurs', chapter2: <string> }
 *
 */
type Tracking =
	| string
	| {
			chapter1?: string
			chapter2?: string
			chapter3?: string
	  }

export interface SimulatorsDataParams {
	t: TFunction
	sitePaths: AbsoluteSitePaths
	language: string
}