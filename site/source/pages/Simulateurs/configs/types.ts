import { DottedName } from 'modele-social'
import { ASTNode, PublicodesExpression } from 'publicodes'
import { FC, LazyExoticComponent } from 'react'

export type Situation = Partial<
	Record<DottedName, PublicodesExpression | ASTNode>
>

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
		 * Question non prioritaires
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

export interface PageConfig {
	path?: string
	iframePath: string
	pathId: string
	icône: string
	shortName: string
	title: string
	tracking:
		| string
		| {
				chapter1?: string
				chapter2?: string
				chapter3?: string
		  }
	meta: {
		title: string
		description: string
		ogDescription?: string
		ogTitle?: string
		ogImage?: string
		color?: string
	}
	private?: boolean
	beta?: boolean
	tooltip?: string
	nextSteps?: string[]

	simulation?: SimulationConfig
	component?: () => JSX.Element
	lazyComponent?: LazyExoticComponent<FC<unknown>>
	seoExplanations?: JSX.Element
}
