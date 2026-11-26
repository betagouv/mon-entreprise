import { composeWithDevToolsDevelopmentOnly } from '@redux-devtools/extension'
import { createReduxEnhancer } from '@sentry/react'
import { applyMiddleware, createStore, StoreEnhancer } from 'redux'

import { setupSimulationPersistence } from '@/storage/persistSimulation'
import { prendLaProchaineQuestionMiddleware } from '@/store/middlewares/prendLaProchaineQuestion.middleware'
import rootReducer from '@/store/reducers/rootReducer'

const sentryReduxEnhancer = createReduxEnhancer({}) as StoreEnhancer

export const makeStore = ({
	traceActions = false,
}: { traceActions?: boolean } = {}) => {
	const composeEnhancers = composeWithDevToolsDevelopmentOnly(
		traceActions ? { trace: true, traceLimit: 25 } : {}
	)

	const storeEnhancer = composeEnhancers(
		applyMiddleware(prendLaProchaineQuestionMiddleware),
		sentryReduxEnhancer
	)

	const store = createStore(rootReducer, storeEnhancer)

	setupSimulationPersistence(store)

	return store
}
