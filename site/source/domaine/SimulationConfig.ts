import { DottedName } from 'modele-social'

import { Situation } from './Situation'

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

	'règles à ignorer pour déclencher les questions'?: DottedName[]
}>
