import { composeWithDevToolsDevelopmentOnly } from '@redux-devtools/extension'
import { createReduxEnhancer } from '@sentry/react'
import { StoreEnhancer, applyMiddleware, createStore } from 'redux'

import reducers from '@/store/reducers/rootReducer'

import {
	retrievePersistedChoixStatutJuridique,
	setupChoixStatutJuridiquePersistence,
} from '../storage/persistChoixStatutJuridique'
import {
	retrievePersistedCompanySituation,
	setupCompanySituationPersistence,
} from '../storage/persistCompanySituation'
import { setupSimulationPersistence } from '../storage/persistSimulation'

const initialStore = {
	choixStatutJuridique: retrievePersistedChoixStatutJuridique(),
	companySituation: retrievePersistedCompanySituation(),
}

const composeEnhancers = composeWithDevToolsDevelopmentOnly(
	import.meta.env.VITE_REDUX_TRACE ? { trace: true, traceLimit: 25 } : {}
)

const sentryReduxEnhancer = createReduxEnhancer({}) as StoreEnhancer

const storeEnhancer = composeEnhancers(applyMiddleware(), sentryReduxEnhancer)

export const store = createStore(reducers, initialStore, storeEnhancer)

setupChoixStatutJuridiquePersistence(store)
setupCompanySituationPersistence(store)
setupSimulationPersistence(store)
