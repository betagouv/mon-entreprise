import { useMemo } from 'react'

import { getCachedEngine, loadEngine } from '@/domaine/engine/engineCache'
import { NomModèle } from '@/domaine/SimulationConfig'

import { useCurrentSimulatorData } from './useCurrentSimulatorData'

export const useEngine = (nomModèleFourni?: NomModèle) => {
	const { currentSimulatorData } = useCurrentSimulatorData()
	const nomModèleConfig = currentSimulatorData?.simulation
		?.nomModèle as NomModèle

	const nomModèle = nomModèleFourni ?? nomModèleConfig

	if (!nomModèle) {
		throw new Error('Nom de modèle manquant.')
	}

	let engine = getCachedEngine(nomModèle)

	const resource = useMemo(() => {
		return loadEngine(nomModèle)
	}, [nomModèle])

	if (!engine) {
		engine = resource.read()
	}

	return engine
}
