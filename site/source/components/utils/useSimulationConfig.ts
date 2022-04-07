import { loadPreviousSimulation, setSimulationConfig } from '@/actions/actions'
import { SimulationConfig } from '@/reducers/rootReducer'
import { configSelector } from '@/selectors/simulationSelectors'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

export default function useSimulationConfig(
	config: SimulationConfig | undefined,
	{
		path,
		autoloadLastSimulation = false,
	}: { path: string; autoloadLastSimulation?: boolean }
) {
	const dispatch = useDispatch()

	const lastConfig = useSelector(configSelector)
	if (config && lastConfig !== config) {
		dispatch(setSimulationConfig(config ?? {}, path))
	}
	useEffect(() => {
		if (autoloadLastSimulation) {
			dispatch(loadPreviousSimulation())
		}
	}, [])
}
