import { useEffect, useLayoutEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { useSetupSafeSituation } from '@/hooks/useSetupSafeSituation'
import { environnement } from '@/services/environnement'
import {
	chargeLaSimulationPrécédente,
	configureLaSimulation,
} from '@/store/actions/actions'
import { PublicodesSimulationConfig } from '@/store/reducers/rootReducer'
import { configSelector } from '@/store/selectors/simulation/config/config.selector'
import { simulationKeySelector } from '@/store/selectors/simulation/simulationKey.selector'

export default function useSimulationConfig({
	key,
	url,
	config,
}: {
	key: string
	url: string
	config?: PublicodesSimulationConfig
}) {
	const autoloadLastSimulation = config?.autoloadLastSimulation ?? false
	const dispatch = useDispatch()

	const lastConfig = useSelector(configSelector)
	const lastKey = useSelector(simulationKeySelector)

	// Configuring the store in an effect would run after hydration, so the client's
	// first render would no longer match the server HTML.
	if (key !== lastKey || (config && lastConfig !== config)) {
		dispatch(configureLaSimulation(config ?? {}, url, key))
	}

	// useLayoutEffect like useEffect does nothing in SSR mode but triggers a warning,
	// so we replace it with useEffect which does not trigger any warning
	const useLayoutEffectWithoutWarnInSSR = environnement.isServerSide
		? useEffect
		: useLayoutEffect

	useLayoutEffectWithoutWarnInSSR(() => {
		if (autoloadLastSimulation) {
			dispatch(chargeLaSimulationPrécédente())
		}
	}, [autoloadLastSimulation, dispatch])

	useSetupSafeSituation(config?.nomModèle)
}
