import { useLocation } from 'react-router-dom'

import { useIsEmbedded } from '@/hooks/useIsEmbedded'
import { Merge, ToOptional } from '@/types/utils'

import useSimulatorsData, { SimulatorDataValues } from './useSimulatorsData'

export type MergedSimulatorDataValues = ToOptional<Merge<SimulatorDataValues>>

/**
 * Gets the current simulator data from url
 */
export const useCurrentSimulatorData = () => {
	const simulatorsData = useSimulatorsData()
	const isEmbedded = useIsEmbedded()
	const pathname = decodeURI(useLocation().pathname)

	const entries = Object.entries(simulatorsData)
	const [key, data] =
		(!isEmbedded
			? entries
					.sort((a, b) => b[1].path.length - a[1].path.length)
					.find(([, data]) => pathname.startsWith(data.path))
			: entries
					.sort((a, b) => b[1].iframePath.length - a[1].iframePath.length)
					.find(([, data]) =>
						pathname.startsWith('/iframes/' + data.iframePath)
					)) ?? []

	return {
		key: key as keyof typeof simulatorsData,
		currentSimulatorData: data as MergedSimulatorDataValues | undefined,
	}
}
