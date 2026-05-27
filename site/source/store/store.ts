import { composeWithDevToolsDevelopmentOnly } from '@redux-devtools/extension'
import { createReduxEnhancer } from '@sentry/react'
import { applyMiddleware, createStore, StoreEnhancer } from 'redux'

import {
	retrievePersistedCompanySituation,
	setupCompanySituationPersistence,
} from '@/storage/persistCompanySituation'
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

	const initialStore = {
		companySituation: retrievePersistedCompanySituation(),
	}

	const store = createStore(rootReducer, initialStore, storeEnhancer)

	setupCompanySituationPersistence(store)
	setupSimulationPersistence(store)

	return store
}
