/* @flow */
import type { Situation } from '../types/Situation.js'
import type { TargetInput, State } from '../types/State.js'
import { pipe } from 'ramda'

type PersistedState = {
	situation: Situation,
	activeTargetInput: TargetInput,
	foldedSteps: Array<string>
}

const situationSelector: State => Situation = state =>
	state.form.conversation.values

const persistedStateSelector: State => PersistedState = state => ({
	situation: situationSelector(state),
	activeTargetInput: state.activeTargetInput,
	foldedSteps: state.foldedSteps
})

const createStateFromPersistedState: PersistedState => State = ({
	activeTargetInput,
	situation,
	foldedSteps
}) => ({
	activeTargetInput,
	form: {
		conversation: {
			values: situation
		}
	},
	foldedSteps,
	conversationStarted: true
})

export const serialize: State => string = pipe(
	persistedStateSelector,
	JSON.stringify
)

export const deserialize: string => State = pipe(
	JSON.parse,
	createStateFromPersistedState
)
