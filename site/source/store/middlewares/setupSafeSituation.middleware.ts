import Engine from 'publicodes'
import { Dispatch, Middleware } from 'redux'

import {
	Action,
	deleteFromSituation,
} from '@/store/actions/actions'
import {
	RootState,
} from '@/store/reducers/rootReducer'
import { safeSetSituation } from '@/utils/publicodes/safeSetSituation'
import { companySituationSelector } from '@/store/selectors/companySituation.selector'
import { completeSituationSelector, configSituationSelector, situationSelector } from '@/store/selectors/simulationSelectors'
import { modeleIdSelector } from '../selectors/modeleId.selector'
import { getEngine, setEngineSituation } from '@/utils/publicodes/getEngine'

export const setupSafeSituationMiddleware: Middleware<
		object,
		RootState,
		Dispatch<Action>
	> = (store) => (next) => (action: Action) => {
		const state = store.getState()
		console.log(action.type)
		
		const simulatorSituation = situationSelector(state)
		const configSituation = configSituationSelector(state)
		const companySituation = companySituationSelector(state)
		const rawSituation = completeSituationSelector(state)
		const modeleId = modeleIdSelector(state)!
		const engine = getEngine(modeleId)
		console.log('initial engine situation', engine.getSituation())

		try {
			safeSetSituation(modeleId, rawSituation, ({ faultyDottedName }) => {
				if (!faultyDottedName) {
					throw new Error('Bad empty faultyDottedName')
				}
	
				if (faultyDottedName in simulatorSituation) {
					store.dispatch(deleteFromSituation(faultyDottedName))
				} else {
					if(faultyDottedName in configSituation) {
						throw new Error(
							'Bad config situation : ' +
							JSON.stringify(faultyDottedName)
						)
					}
					if (faultyDottedName in companySituation) {
						throw new Error(
							'Bad company situation : ' +
							JSON.stringify(faultyDottedName)
						)

					}

					throw new Error(
						'Bad unknow situation : ' +
						JSON.stringify(faultyDottedName)
					)
				}
			})
		} catch (error) {
			// eslint-disable-next-line no-console
			console.error(error)
	
			setEngineSituation(modeleId, {})
		}
		console.log('engine situation', engine.getSituation())

		return next(action)
	}
