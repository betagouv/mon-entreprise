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

const initialStore = {
	companySituation: retrievePersistedCompanySituation(),
}

const composeEnhancers = composeWithDevToolsDevelopmentOnly(
	import.meta.env.VITE_REDUX_TRACE ? { trace: true, traceLimit: 25 } : {}
)

const sentryReduxEnhancer = createReduxEnhancer({}) as StoreEnhancer

export const makeStore = () => {
	const storeEnhancer = composeEnhancers(
		applyMiddleware(prendLaProchaineQuestionMiddleware),
		sentryReduxEnhancer
	)

	const store = createStore(rootReducer, initialStore, storeEnhancer)

	setupCompanySituationPersistence(store)
	setupSimulationPersistence(store)

	return store
}
