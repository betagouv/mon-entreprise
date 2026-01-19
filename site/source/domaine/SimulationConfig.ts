import { DottedName } from './publicodes/DottedName'
import { RaccourciPublicodes } from './RaccourciPublicodes'
import { SituationPublicodes } from './SituationPublicodes'

export type SimulationConfig = Partial<{
	nomModèle: NomModèle

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
	situation: SituationPublicodes

	questions: {
		/**
		 * Question non prioritaires, elles aparraitront en fin de simulation
		 */
		'non prioritaires'?: DottedName[]

		/**
		 * Whitelist des questions qui sont affichées à l'utilisateur.
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
		raccourcis?: RaccourciPublicodes[]
	}

	'unité par défaut'?: string

	'règles à ignorer pour déclencher les questions'?: DottedName[]
}>

export type NomModèle = 'modele-social' | 'modele-as' | 'modele-ti'
