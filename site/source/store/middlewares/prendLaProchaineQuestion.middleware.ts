/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import * as Array from 'effect/Array'
import * as String from 'effect/String'
import Engine from 'publicodes'
import { Dispatch, Middleware } from 'redux'

import { détermineLesProchainesQuestions } from '@/domaine/engine/détermineLesProchainesQuestions'
import { SimulationConfig } from '@/domaine/SimulationConfig'
import { Action, questionsSuivantes } from '@/store/actions/actions'
import { RootState } from '@/store/reducers/rootReducer'
import { rawSituationSelector } from '@/store/selectors/simulationSelectors'
import { complement } from '@/utils/complement'

export const prendLaProchaineQuestionMiddleware =
	(engine: Engine): Middleware<object, RootState, Dispatch<Action>> =>
	(store) =>
	(next) =>
	(action) => {
		const result = next(action)

		const newState = store.getState()

		const config = newState.simulation?.config
		const situation = rawSituationSelector(newState)
		const questionsRépondues = newState.simulation?.answeredQuestions
		const questionsSuivantesActuelles =
			newState.simulation?.questionsSuivantes || []

		if (situation && config) {
			engine.setSituation(situation)

			const prochainesQuestions = détermineLesProchainesQuestions(
				engine,
				config as SimulationConfig,
				questionsRépondues
			)

			if (
				arraysAreDifferent(prochainesQuestions, questionsSuivantesActuelles)
			) {
				store.dispatch(questionsSuivantes(prochainesQuestions))
			}
		}

		return result
	}

const arraysAreDifferent = complement(Array.getEquivalence(String.Equivalence))
