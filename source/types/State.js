/* @flow */
import type { Situation } from './Situation.js'

export type TargetInput =
	| 'contrat salarié . salaire de base'
	| 'contrat salarié . salaire total'
	| 'contrat salarié . salaire de net'

export type SavedSimulation = {
	situation: Situation,
	activeTargetInput: TargetInput,
	foldedSteps: Array<string>
}

export type FlatRules = {
	[string]: {
		titre: string
	}
}
export type State = {
	form: {
		conversation: {
			values: Situation
		}
	},
	previousSimulation: ?SavedSimulation,
	conversationSteps: {
		foldedSteps: Array<string>,
		currentQuestion: ?string
	},
	activeTargetInput: TargetInput,
	conversationStarted: boolean
}
