/* @flow */
import type { Situation } from '../types/Situation.js'

export type TargetInput =
	| 'contrat salarié . salaire de base'
	| 'contrat salarié . salaire total'
	| 'contrat salarié . salaire de net'

export type State = {
	form: {
		conversation: {
			values: Situation
		}
	},
	foldedSteps: Array<string>,
	activeTargetInput: TargetInput,
	conversationStarted: boolean
}
