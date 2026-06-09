import { TFunction } from 'i18next'

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

	questions: QuestionsAutoGénérées | QuestionsÉditorialisées

	'unité par défaut'?: string

	'règles à ignorer pour déclencher les questions'?: DottedName[]

	'notifications à ignorer'?: DottedName[]
}>

export type NomModèle = 'modele-social' | 'modele-as' | 'modele-ti'

export type QuestionsAutoGénérées = {
	// Questions non prioritaires, elles aparaîtront en fin de simulation
	'non prioritaires'?: DottedName[]
	/**
	 * Liste blanche des questions qui sont affichées à l'utilisateurice.
	 * Cela peut également servir pour prioriser des questions
	 * en mettant une string vide comme dernier élément.
	 */
	liste?: (DottedName | '')[]
	// Questions qui ne sont pas affichées à l'utilisateurice
	'liste noire'?: DottedName[]
	// Questions "raccourcis" sélectionnables en bas du simulateur
	raccourcis?: RaccourciPublicodes[]
}

export type QuestionsÉditorialisées = Record<
	string,
	{
		titre: (t: TFunction) => string
		liste: Array<{
			libellé: (t: TFunction) => string
			dottedName: DottedName
		}>
	}
>
