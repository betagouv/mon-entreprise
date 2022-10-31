import { DottedName } from 'modele-social'
import { ASTNode, PublicodesExpression } from 'publicodes'

export type Situation = Partial<
	Record<DottedName, PublicodesExpression | ASTNode>
>

export type SimulationConfig = Partial<{
	/**
	 * Les objectifs sont mutuellement exclusifs : lors d'un changement de situation
	 * si une règle qui est dans objectifs est modifiée alors toutes les autres règles
	 * qui sont dans objectifs sont retirées de la situation
	 */

	objectifs: DottedName[]
	/**
	 * Objectifs non visibles pour les utilisateurs mais néanmoins utiles
	 */
	'objectifs cachés'?: DottedName[]

	/**
	 * La situation de base du simulateur
	 */
	situation: Situation

	'unité par défaut': string

	questions: {
		'non prioritaires'?: DottedName[]
		/**
		 * TODO
		 */
		liste?: DottedName[]
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
}>
