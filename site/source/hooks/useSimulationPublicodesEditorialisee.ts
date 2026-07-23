import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import {
	NomModèle,
	PublicodesSimulationConfig,
	QuestionsÉditorialisées,
} from '@/domaine/PublicodesSimulationConfig'
import { PageMetadata } from '@/pages/simulateurs/_configs/types'
import { réinitialiseLaSimulation } from '@/store/actions/actions'
import { simulationKeySelector } from '@/store/selectors/simulation/simulationKey.selector'
import { situationSelector } from '@/store/selectors/simulation/situation/situation.selector'

import { useEngineFromModèle } from './useEngineFromModèle'
import { useQuestionsPublicodesÉditorialisées } from './useQuestionsPublicodesEditorialisees'
import useSetSimulationFromSearchParams from './useSetSimulationFromSearchParams'
import useSimulationConfig from './useSimulationConfig'

export default function useSimulationPublicodesÉditorialisées(
	{ id, path }: Pick<PageMetadata, 'id' | 'path'>,
	simulation: PublicodesSimulationConfig
) {
	const nomModèle = simulation.nomModèle as NomModèle
	const {
		'questions principales': questionsPrincipales,
		'groupes de questions': groupesDeQuestions,
	} = simulation.questions as QuestionsÉditorialisées

	useSimulationConfig({
		key: id,
		url: path,
		config: simulation,
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
