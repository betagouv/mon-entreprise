/* @flow */
import type { Situation } from './Situation.js'
import type { Analysis } from './Analysis.js'

export type TargetInput =
	| 'contrat salarié . salaire de base'
	| 'contrat salarié . salaire total'
	| 'contrat salarié . salaire de net'

export type SavedSimulation = {
	situation: Situation,
	activeTargetInput: TargetInput,
	foldedSteps: Array<string>
}

export type State = {
	form: {
		conversation: {
			values: Situation
		}
	},
	previousSimulation: ?SavedSimulation,
	foldedSteps: Array<string>,
	activeTargetInput: TargetInput,
	conversationStarted: boolean,
	analysis: Analysis
}
