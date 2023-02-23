import { useLocation } from 'react-router-dom'

import { Merge, ToOptional } from '@/types/utils'

import useSimulatorsData, { SimulatorDataValues } from './useSimulatorsData'

export type MergedSimulatorDataValues = ToOptional<Merge<SimulatorDataValues>>

/**
 * Gets the current simulator data from url
 */
export const useCurrentSimulatorData = () => {
	const simulatorsData = useSimulatorsData()
	const pathname = decodeURI(useLocation().pathname)

	const [key, data] =
		Object.entries(simulatorsData).find(
			([, data]) =>
				pathname.startsWith(data.path) ||
				pathname.startsWith('/iframes/' + data.iframePath)
		) ?? []

	return { key, currentSimulatorData: data as MergedSimulatorDataValues }
}
