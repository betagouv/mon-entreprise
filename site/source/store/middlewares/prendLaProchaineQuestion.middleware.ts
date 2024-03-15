/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import Engine from 'publicodes'
import { Middleware } from 'redux'

import { RootState } from '@/store/reducers/rootReducer'
import { currentQuestionSelector } from '@/store/selectors/simulationSelectors'

export const prendLaProchaineQuestionMiddleware =
	(engine: Engine): Middleware<object, RootState> =>
	(store) =>
	(next) =>
	(action) => {
		const result = next(action)

		const newState = store.getState()

		if (currentQuestionSelector(newState) === null) {
			console.log('Prendre la prochaine question')
			// génére prochaine question
			// dispatch(());
		}

		return result
	}
