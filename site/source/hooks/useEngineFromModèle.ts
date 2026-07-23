import { getCachedEngine, loadEngine } from '@/domaine/engine/engineCache'
import { NomModèle } from '@/domaine/PublicodesSimulationConfig'

export const useEngineFromModèle = (nomModèle: NomModèle) => {
	const engine = getCachedEngine(nomModèle)

	if (engine) {
		return engine
	}

	const resource = loadEngine(nomModèle)

	return resource.read()
}
