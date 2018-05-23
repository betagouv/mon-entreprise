/* @flow */
import type { State, SavedSimulation } from '../types/State.js'
import { pipe } from 'ramda'
import { currentSimulationSelector } from './selectors'

export const serialize: State => string = pipe(
	currentSimulationSelector,
	JSON.stringify
)

export const deserialize: string => SavedSimulation = JSON.parse
