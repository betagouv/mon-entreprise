import deepEql from 'deep-eql'
import * as Array from 'effect/Array'
import * as String from 'effect/String'
import Engine from 'publicodes'
import { Dispatch, Middleware } from 'redux'

import { détermineLesProchainesQuestions } from '@/domaine/engine/détermineLesProchainesQuestions'
import {
	Action,
	applicabilitéDesQuestionsRépondues,
	questionsSuivantes,
} from '@/store/actions/actions'
import { RootState, Situation } from '@/store/reducers/rootReducer'
import { Simulation } from '@/store/reducers/simulation.reducer'
import { completeSituationSelector } from '@/store/selectors/simulationSelectors'
import { complement } from '@/utils/complement'

let lastSimulation: Simulation | null = null
let lastSituation: Situation | null = null

export const prendLaProchaineQuestionMiddleware =
	(engine: Engine): Middleware<object, RootState, Dispatch<Action>> =>
	(store) =>
	(next) =>
	(action: Action) => {
		const result = next(action)

		const newState = store.getState()

		const simulation = newState.simulation
		const config = simulation?.config
		const situation = completeSituationSelector(newState)
		const questionsRépondues = simulation?.questionsRépondues
		const questionsSuivantesActuelles = simulation?.questionsSuivantes || []

		if (action.type === 'SET_SIMULATION') {
			lastSituation = null
			lastSimulation = null
		}

		if (situation && config && engine && simulation !== lastSimulation) {
			const situationAChangé =
				!!lastSituation &&
				!deepEql<Situation, Situation>(situation, lastSituation)

			if (!lastSituation || situationAChangé) {
				lastSituation = situation

				engine.setSituation(situation)

				lastSimulation = simulation

				store.dispatch(
					applicabilitéDesQuestionsRépondues(
						(questionsRépondues || []).map((question) => ({
							...question,
							applicable:
								engine.evaluate({ 'est applicable': question.règle })
									.nodeValue === true,
						}))
					)
				)

				const prochainesQuestions = détermineLesProchainesQuestions(
					engine,
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
