import { useSelector } from 'react-redux'

import { NomModèle, PublicodesSimulationConfig } from '@/domaine/PublicodesSimulationConfig'
import { simulationKeySelector } from '@/store/selectors/simulation/simulationKey.selector'

import { MergedSimulatorDataValues } from './useCurrentSimulatorData'
import { useEngineFromModèle } from './useEngineFromModèle'
import { useQuestionsPublicodes } from './useQuestionsPublicodes'
import useSetSimulationFromSearchParams from './useSetSimulationFromSearchParams'
import useSimulationConfig from './useSimulationConfig'

export default function useSimulationPublicodes(
	simulatorConfig: MergedSimulatorDataValues
) {
	const { id, path, simulation, autoloadLastSimulation } = simulatorConfig
	const nomModèle = simulation?.nomModèle as NomModèle

	useSimulationConfig({
		key: id,
		url: path,
		config: simulation as PublicodesSimulationConfig,
		autoloadLastSimulation,
	})
	useSetSimulationFromSearchParams(nomModèle)

	const engine = useEngineFromModèle(nomModèle)

	const currentKey = useSelector(simulationKeySelector)

	const { questions, raccourcis } = useQuestionsPublicodes(nomModèle)

	return {
		isReady: currentKey === id,
		engine,
		questions,
		raccourcis,
	}
}
