import { useCurrentSimulatorData } from '@/hooks/useCurrentSimulatorData'
import { useNavigation } from '@/lib/navigation'


export default function SimulateurOrAssistantPage() {
	const { currentSimulatorData } = useCurrentSimulatorData()
	const { currentPath } = useNavigation()

	if (!currentSimulatorData) {
		throw new Error(`No simulator found with url: ${currentPath}`)
	}

	const Component = currentSimulatorData.component

	return <Component />
}
