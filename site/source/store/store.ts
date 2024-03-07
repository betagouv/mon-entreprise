import { composeWithDevToolsDevelopmentOnly } from '@redux-devtools/extension'
import { createReduxEnhancer } from '@sentry/react'
import Engine from 'publicodes'
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
import { prendLaProchaineQuestionMiddleware } from '@/store/middlewares/prendLaProchaineQuestion.middleware'
import reducers from '@/store/reducers/rootReducer'

const initialStore = {
	choixStatutJuridique: retrievePersistedChoixStatutJuridique(),
	companySituation: retrievePersistedCompanySituation(),
}

const composeEnhancers = composeWithDevToolsDevelopmentOnly(
	import.meta.env.VITE_REDUX_TRACE ? { trace: true, traceLimit: 25 } : {}
)

const sentryReduxEnhancer = createReduxEnhancer({}) as StoreEnhancer

export const makeStore = (engine: Engine) => {
	const storeEnhancer = composeEnhancers(
		applyMiddleware(prendLaProchaineQuestionMiddleware(engine)),
		sentryReduxEnhancer
	)

	const store = createStore(reducers, initialStore, storeEnhancer)

	setupChoixStatutJuridiquePersistence(store)
	setupCompanySituationPersistence(store)
	setupSimulationPersistence(store)

	return store
}
