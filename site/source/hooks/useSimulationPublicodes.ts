import { useSelector } from 'react-redux'

import {
	NomModèle,
	PublicodesSimulationConfig,
} from '@/domaine/PublicodesSimulationConfig'
import { PageMetadata } from '@/pages/simulateurs/_configs/types'
import { simulationKeySelector } from '@/store/selectors/simulation/simulationKey.selector'

import { useEngineFromModèle } from './useEngineFromModèle'
import { useQuestionsPublicodes } from './useQuestionsPublicodes'
import useSetSimulationFromSearchParams from './useSetSimulationFromSearchParams'
import useSimulationConfig from './useSimulationConfig'

export default function useSimulationPublicodes(
	{ id, path }: Pick<PageMetadata, 'id' | 'path'>,
	simulation: PublicodesSimulationConfig
) {
	const nomModèle = simulation.nomModèle as NomModèle

	useSimulationConfig({
		key: id,
		url: path,
		config: simulation,
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
