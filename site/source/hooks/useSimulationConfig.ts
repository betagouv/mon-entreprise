import { useEffect, useLayoutEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { useSetupSafeSituation } from '@/components/utils/EngineContext'
import {
	loadPreviousSimulation,
	setSimulationConfig,
} from '@/store/actions/actions'
import { SimulationConfig } from '@/store/reducers/rootReducer'
import { configSelector } from '@/store/selectors/config.selector'

import { useEngine } from './useEngine'

export default function useSimulationConfig({
	key,
	config,
	autoloadLastSimulation = false,
}: {
	key: string
	config?: SimulationConfig
	autoloadLastSimulation?: boolean
}) {
	const dispatch = useDispatch()

	// Initialize redux store in SSR mode
	if (import.meta.env.SSR) {
		dispatch(setSimulationConfig(config ?? {}, key))
	}

	const lastConfig = useSelector(configSelector)

	// useLayoutEffect like useEffect does nothing in SSR mode but triggers a warning,
	// so we replace it with useEffect which does not trigger any warning
	const useLayoutEffectWithoutWarnInSSR = import.meta.env.SSR
		? useEffect
		: useLayoutEffect

	useLayoutEffectWithoutWarnInSSR(() => {
		if (config && lastConfig !== config) {
			dispatch(setSimulationConfig(config ?? {}, key))
		}
		if (autoloadLastSimulation) {
			dispatch(loadPreviousSimulation())
		}
	}, [config, dispatch, lastConfig, key])

	useSetupSafeSituation(useEngine())
}
