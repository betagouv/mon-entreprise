/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import deepEql from 'deep-eql'
import * as Array from 'effect/Array'
import { NonEmptyArray } from 'effect/Array'
import * as String from 'effect/String'
import Engine from 'publicodes'
import { Dispatch, Middleware } from 'redux'

import { isComparateurConfig } from '@/domaine/ComparateurConfig'
import { détermineLesProchainesQuestions } from '@/domaine/engine/détermineLesProchainesQuestions'
import { Action, questionsSuivantes } from '@/store/actions/actions'
import {
	RootState,
	SimulationConfig,
	Situation,
} from '@/store/reducers/rootReducer'
import { Simulation } from '@/store/reducers/simulation.reducer'
import {
	rawSituationSelector,
	rawSituationsSelonContextesSelector,
} from '@/store/selectors/simulationSelectors'
import { complement } from '@/utils/complement'

let lastSimulation: Simulation | null = null
let lastConfig: SimulationConfig | null = null
let lastSituationsAvecContextes: NonEmptyArray<Situation> | null = null
let engines: NonEmptyArray<Engine> | null = null

export const prendLaProchaineQuestionMiddleware =
	(engine: Engine): Middleware<object, RootState, Dispatch<Action>> =>
	(store) =>
	(next) =>
	(action) => {
		const result = next(action)

		const newState = store.getState()

		const simulation = newState.simulation
		const config = simulation?.config
		const situation = rawSituationSelector(newState)
		const questionsRépondues = simulation?.answeredQuestions
		const questionsSuivantesActuelles = simulation?.questionsSuivantes || []

		const configHasChanged = lastConfig !== config

		if (config && configHasChanged) {
			engines = isComparateurConfig(config)
				? (config.contextes.map(() =>
						engine.shallowCopy()
				  ) as NonEmptyArray<Engine>)
				: [engine]
			lastSituationsAvecContextes = null
		}

		if (action.type === 'SET_SIMULATION') {
			lastConfig = null
			lastSituationsAvecContextes = null
			lastSimulation = null
		}

		if (situation && config && engines && simulation !== lastSimulation) {
			const situationsAvecContextes =
				rawSituationsSelonContextesSelector(newState)

			const situationAChangé =
				!!lastSituationsAvecContextes &&
				!deepEql<NonEmptyArray<Situation>, NonEmptyArray<Situation>>(
					situationsAvecContextes,
					lastSituationsAvecContextes
				)

			if (!lastSituationsAvecContextes || situationAChangé) {
				lastSituationsAvecContextes = situationsAvecContextes

				engines.forEach((engine, index) =>
					engine.setSituation(situationsAvecContextes[index])
				)

				lastSimulation = simulation
				lastConfig = config

				const prochainesQuestions = détermineLesProchainesQuestions(
					engines,
					config,
					questionsRépondues
				)

				if (
					arraysAreDifferent(prochainesQuestions, questionsSuivantesActuelles)
				) {
					store.dispatch(questionsSuivantes(prochainesQuestions))
				}
			}
		}

		return result
	}

const arraysAreDifferent = complement(Array.getEquivalence(String.Equivalence))
