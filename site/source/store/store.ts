import { composeWithDevToolsDevelopmentOnly } from '@redux-devtools/extension'
import { createReduxEnhancer } from '@sentry/react'
import { applyMiddleware, createStore, StoreEnhancer } from 'redux'

import {
	retrievePersistedChoixStatutJuridique,
	setupChoixStatutJuridiquePersistence,
} from '@/storage/persistChoixStatutJuridique'
import {
	retrievePersistedCompanySituation,
	setupCompanySituationPersistence,
} from '@/storage/persistCompanySituation'
import { setupSimulationPersistence } from '@/storage/persistSimulation'
import reducers from '@/store/reducers/rootReducer'
import { setupSafeSituationMiddleware } from './middlewares/setupSafeSituation.middleware'

import { chargeEngineSelonConfig } from './middlewares/chargeEngineSelonConfig'
import { prendLaProchaineQuestionMiddleware } from './middlewares/prendLaProchaineQuestion.middleware'

export const initialStore = {
	choixStatutJuridique: retrievePersistedChoixStatutJuridique(),
	companySituation: retrievePersistedCompanySituation(),
}

const composeEnhancers = composeWithDevToolsDevelopmentOnly(
	import.meta.env.VITE_REDUX_TRACE ? { trace: true, traceLimit: 25 } : {}
)

const sentryReduxEnhancer = createReduxEnhancer({}) as StoreEnhancer

export const makeStore = () => {
	const storeEnhancer = composeEnhancers(
		applyMiddleware(
			// setupSafeSituationMiddleware,
			// chargeEngineSelonConfig,
			prendLaProchaineQuestionMiddleware
		),
		sentryReduxEnhancer
	)

	const store = createStore(reducers, initialStore, storeEnhancer)

	setupChoixStatutJuridiquePersistence(store)
	setupCompanySituationPersistence(store)
	setupSimulationPersistence(store)

	return store
}
