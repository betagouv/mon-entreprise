import { SimulatorDataValues } from '@/pages/simulateurs-et-assistants/configs-src'
import { Merge, ToOptional } from '@/types/utils'

import useSimulatorsData, { SimulateurId } from './useSimulatorsData'

export type MergedSimulatorDataValues = ToOptional<Merge<SimulatorDataValues>>

export const useSimulatorData = (simulateurId: SimulateurId) =>
	useSimulatorsData()[simulateurId] as MergedSimulatorDataValues
