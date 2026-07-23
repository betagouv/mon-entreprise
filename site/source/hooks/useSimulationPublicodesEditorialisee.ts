import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import {
	NomModèle,
	QuestionsÉditorialisées,
	PublicodesSimulationConfig,
} from '@/domaine/PublicodesSimulationConfig'
import { réinitialiseLaSimulation } from '@/store/actions/actions'
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
	const {
		'questions principales': questionsPrincipales,
		'groupes de questions': groupesDeQuestions,
	} = simulation?.questions as QuestionsÉditorialisées

	useSimulationConfig({
		key: id,
		url: path,
		config: simulation as PublicodesSimulationConfig,
		autoloadLastSimulation,
	})
	useSetSimulationFromSearchParams(nomModèle)

	const engine = useEngineFromModèle(nomModèle)

	const currentKey = useSelector(simulationKeySelector)

	const { questionsPublicodesPrincipales, groupesDeQuestionsPublicodes } =
		useQuestionsPublicodesÉditorialisées(
			nomModèle,
			questionsPrincipales,
			groupesDeQuestions
		)

	const situation = useSelector(situationSelector)
	const simulationEstCommencée = Object.keys(situation).length > 0

	const dispatch = useDispatch()
	const onReset = useCallback(
		() => dispatch(réinitialiseLaSimulation()),
		[dispatch]
	)

	return {
		isReady: currentKey === id,
		engine,
		questionsPrincipales: questionsPublicodesPrincipales,
		groupesDeQuestions: groupesDeQuestionsPublicodes,
		simulationEstCommencée,
		onReset,
	}
}
