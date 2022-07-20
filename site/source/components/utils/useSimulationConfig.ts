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

	// Initialize redux store for SSR
	if (import.meta.env.SSR) {
		dispatch(setSimulationConfig(config ?? {}, path))
	}

	const lastConfig = useSelector(configSelector)
	useEffect(() => {
		if (config && lastConfig !== config) {
			dispatch(setSimulationConfig(config ?? {}, path))
		}
	}, [config, dispatch, lastConfig, path])

	useEffect(() => {
		if (autoloadLastSimulation) {
			dispatch(loadPreviousSimulation())
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])
}
