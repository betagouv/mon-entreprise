import { useNavigation } from '@/lib/navigation'

import {
	MergedSimulatorMetadata,
	useSimulatorsMetadata,
} from './useSimulatorsMetadata'

/**
 * Gets the current simulator metadata from url
 */
export const useCurrentSimulatorMetadata = () => {
	const simulatorsMetadata = useSimulatorsMetadata()
	const { currentPath } = useNavigation()
	const pathname = decodeURI(currentPath)

	const entries = Object.entries(simulatorsMetadata)
	const [key, metadata] =
		// Find the simulator with classic path
		entries
			.sort((a, b) => b[1].path.length - a[1].path.length)
			.find(([, m]) => pathname.startsWith(m.path)) ??
		// Find the simulator with iframe path
		entries
			.sort((a, b) => b[1].iframePath.length - a[1].iframePath.length)
			.find(([, m]) => pathname.startsWith('/iframes/' + m.iframePath)) ??
		[]

	return {
		key: key as keyof typeof simulatorsMetadata,
		currentSimulatorMetadata: metadata as MergedSimulatorMetadata | undefined,
	}
}
