import { useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'

import { useCurrentSimulatorData } from '@/hooks/useCurrentSimulatorData'
import { useEngine } from '@/hooks/useEngine'
import useSetSimulationFromSearchParams from '@/hooks/useSetSimulationFromSearchParams'
import useSimulationConfig from '@/hooks/useSimulationConfig'
import { ConditionalExternalLink } from '@/pages/simulateurs/_configs/types'
import { Simulation } from '@/store/reducers/simulation.reducer'
import { simulationKeySelector } from '@/store/selectors/simulation/simulationKey.selector'

import SimulateurOrAssistantPage from './SimulateurOrAssistantPage'
import Loader from './utils/Loader'

export default function SimulateurOrAssistantPageWithPublicodes() {
	const { key, currentSimulatorData } = useCurrentSimulatorData()
	const { pathname } = useLocation()
	if (!currentSimulatorData) {
		throw new Error(`No simulator found with url: ${pathname}`)
	}

	const { simulation, conditionalExternalLinks, autoloadLastSimulation, path } =
		currentSimulatorData

	useSimulationConfig({
		key,
		url: path,
		config: simulation as Simulation,
		autoloadLastSimulation,
	})
	useSetSimulationFromSearchParams()
	const engine = useEngine()

	const currentKey = useSelector(simulationKeySelector)

	if (currentKey !== key) {
		return <Loader />
	}

	const relevantConditionalExternalLinks = conditionalExternalLinks?.filter(
		({ associatedRule }: ConditionalExternalLink) =>
			engine.evaluate(associatedRule).nodeValue
	) as ConditionalExternalLink[]

	return (
		<SimulateurOrAssistantPage
			additionalExternalLinks={relevantConditionalExternalLinks}
		/>
	)
}
