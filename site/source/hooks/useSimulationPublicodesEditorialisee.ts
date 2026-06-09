import { useSelector } from 'react-redux'

import {
	NomModèle,
	QuestionsÉditorialisées,
	SimulationConfig,
} from '@/domaine/SimulationConfig'
import { simulationKeySelector } from '@/store/selectors/simulation/simulationKey.selector'
import { situationSelector } from '@/store/selectors/simulation/situation/situation.selector'

import { MergedSimulatorDataValues } from './useCurrentSimulatorData'
import { useEngineFromModèle } from './useEngineFromModèle'
import { useQuestionsPublicodesÉditorialisées } from './useQuestionsPublicodesEditorialisees'
import useSetSimulationFromSearchParams from './useSetSimulationFromSearchParams'
import useSimulationConfig from './useSimulationConfig'

export default function useSimulationPublicodesÉditorialisées(
	simulatorConfig: MergedSimulatorDataValues
) {
	const { id, path, simulation, autoloadLastSimulation } = simulatorConfig
	const nomModèle = simulation?.nomModèle as NomModèle
	const questionsÉditorialisées =
		simulation?.questions as QuestionsÉditorialisées

	useSimulationConfig({
		key: id,
		url: path,
		config: simulation as SimulationConfig,
		autoloadLastSimulation,
	})
	useSetSimulationFromSearchParams(nomModèle)

	const engine = useEngineFromModèle(nomModèle)

	const currentKey = useSelector(simulationKeySelector)

	const groupesDeQuestionsPublicodes = useQuestionsPublicodesÉditorialisées(
		nomModèle,
		questionsÉditorialisées
	)

	const situation = useSelector(situationSelector)
	const simulationEstCommencée = Object.keys(situation).length > 0

	return {
		isReady: currentKey === id,
		engine,
		groupesDeQuestions: groupesDeQuestionsPublicodes,
		simulationEstCommencée,
	}
}
