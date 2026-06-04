import { useSelector } from 'react-redux'

import { DottedName } from '@/domaine/publicodes/DottedName'
import { NomModèle, SimulationConfig } from '@/domaine/SimulationConfig'
import { simulationKeySelector } from '@/store/selectors/simulation/simulationKey.selector'
import { situationSelector } from '@/store/selectors/simulation/situation/situation.selector'

import { MergedSimulatorDataValues } from './useCurrentSimulatorData'
import { useEngineFromModèle } from './useEngineFromModèle'
import { useQuestionsPublicodes } from './useQuestionsPublicodesV2'
import useSetSimulationFromSearchParams from './useSetSimulationFromSearchParams'
import useSimulationConfig from './useSimulationConfig'

export default function useSimulationPublicodes(
	simulatorConfig: MergedSimulatorDataValues
) {
	const { id, path, simulation, autoloadLastSimulation } = simulatorConfig
	const nomModèle = simulation?.nomModèle as NomModèle
	const idsDesQuestions = simulation?.questions?.liste as DottedName[]

	useSimulationConfig({
		key: id,
		url: path,
		config: simulation as SimulationConfig,
		autoloadLastSimulation,
	})
	useSetSimulationFromSearchParams(nomModèle)

	const engine = useEngineFromModèle(nomModèle)

	const currentKey = useSelector(simulationKeySelector)

	const questions = useQuestionsPublicodes(nomModèle, idsDesQuestions)

	const situation = useSelector(situationSelector)
	const simulationEstCommencée = Object.keys(situation).length > 0

	return {
		isReady: currentKey === id,
		engine,
		questions,
		simulationEstCommencée,
	}
}
