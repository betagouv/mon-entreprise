import { useEffect, useLayoutEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { useSetupSafeSituation } from '@/hooks/useSetupSafeSituation'
import {
	chargeLaSimulationPrécédente,
	configureLaSimulation,
} from '@/store/actions/actions'
import { SimulationConfig } from '@/store/reducers/rootReducer'
import { configSelector } from '@/store/selectors/simulation/config/config.selector'

export default function useSimulationConfig({
	id,
	key,
	config,
	autoloadLastSimulation = false,
}: {
	id: string
	key: string
	config?: SimulationConfig
	autoloadLastSimulation?: boolean
}) {
	const dispatch = useDispatch()

	// Initialize redux store in SSR mode
	if (import.meta.env.SSR) {
		dispatch(configureLaSimulation(config ?? {}, key, id))
	}

	const lastConfig = useSelector(configSelector)

	// useLayoutEffect like useEffect does nothing in SSR mode but triggers a warning,
	// so we replace it with useEffect which does not trigger any warning
	const useLayoutEffectWithoutWarnInSSR = import.meta.env.SSR
		? useEffect
		: useLayoutEffect

	useLayoutEffectWithoutWarnInSSR(() => {
		if (config && lastConfig !== config) {
			dispatch(configureLaSimulation(config ?? {}, key, id))
		}
		if (autoloadLastSimulation) {
			dispatch(chargeLaSimulationPrécédente())
		}
	}, [config, dispatch, lastConfig, key])

	useSetupSafeSituation(config?.nomModèle)
}
