import { setSimulationConfig } from '@/actions/actions'
import { SimulationConfig } from '@/reducers/rootReducer'
import { configSelector } from '@/selectors/simulationSelectors'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router'

export default function useSimulationConfig(
	config: SimulationConfig | undefined
) {
	const dispatch = useDispatch()
	// TODO : Reading the URL here is buggy because when we do SPA navigation the
	// "location" retrieved at this point is still the previous URL. What we
	// actually need is to have a simulator identifier, which is currently not
	// accessible from the situation config but is defined in the metadata file.
	const url = useHistory().location.pathname.split('?')[0]

	const lastConfig = useSelector(configSelector)
	useEffect(() => {
		if (config && lastConfig !== config) {
			dispatch(setSimulationConfig(config ?? {}, url))
		}
	}, [config, dispatch, lastConfig, url])
}
