import { useLocation } from 'react-router-dom'

import { SimulatorDataValues } from '@/pages/simulateurs-et-assistants/metadata-src'
import { Merge, ToOptional } from '@/types/utils'

import useSimulatorsData from './useSimulatorsData'

export type MergedSimulatorDataValues = ToOptional<Merge<SimulatorDataValues>>

/**
 * Gets the current simulator data from url
 */
export const useCurrentSimulatorData = () => {
	const simulatorsData = useSimulatorsData()
	const pathname = decodeURI(useLocation().pathname)

	const entries = Object.entries(simulatorsData)
	const [key, data] =
		// Find the simulator with classic path
		entries
			.sort((a, b) => b[1].path.length - a[1].path.length)
			.find(([, data]) => pathname.startsWith(data.path)) ??
		// Find the simulator with iframe path
		entries
			.sort((a, b) => b[1].iframePath.length - a[1].iframePath.length)
			.find(([, data]) => pathname.startsWith('/iframes/' + data.iframePath)) ??
		[]

	return {
		key: key as keyof typeof simulatorsData,
		currentSimulatorData: data as MergedSimulatorDataValues | undefined,
	}
}
