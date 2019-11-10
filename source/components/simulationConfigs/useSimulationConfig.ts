import { resetSimulation, setSimulationConfig } from 'Actions/actions'
import { useDispatch, useSelector } from 'react-redux'
import { RootState, SimulationConfig } from 'Reducers/rootReducer'

export function useSimulationConfig(config: SimulationConfig) {
	const dispatch = useDispatch()
	const stateConfig = useSelector(
		(state: RootState) => state.simulation?.config
	)
	if (config !== stateConfig) {
		dispatch(setSimulationConfig(config))
		if (stateConfig) {
			dispatch(resetSimulation())
		}
	}
}
