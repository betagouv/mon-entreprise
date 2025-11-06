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

	const engine = getCachedEngine(nomModèle)

	if (engine) {
		return engine
	}

	const resource = loadEngine(nomModèle)

	return resource.read()
}
