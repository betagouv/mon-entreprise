import { SimulatorDataValues } from '@/pages/simulateurs-et-assistants/metadata-src'
import { Merge, ToOptional } from '@/types/utils'

import useSimulatorsData, { SimulateurId } from './useSimulatorsData'

export type MergedSimulatorDataValues = ToOptional<Merge<SimulatorDataValues>>

export const useSimulatorData = (simulateurId: SimulateurId) =>
	useSimulatorsData()[simulateurId] as MergedSimulatorDataValues
