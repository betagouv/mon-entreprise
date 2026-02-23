import { useLocation } from 'react-router-dom'

import { useCurrentSimulatorData } from '@/hooks/useCurrentSimulatorData'

export default function SimulateurOrAssistantPage() {
	const { currentSimulatorData } = useCurrentSimulatorData()
	const { pathname } = useLocation()

	if (!currentSimulatorData) {
		throw new Error(`No simulator found with url: ${pathname}`)
	}

	const Component = currentSimulatorData.component

	return <Component />
}
