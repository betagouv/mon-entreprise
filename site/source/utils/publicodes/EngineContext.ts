import Engine from 'publicodes'
import { createContext, useContext } from 'react'

import { DottedName } from '@/domaine/publicodes/DottedName'

export const EngineContext = createContext<Engine<DottedName> | null>(null)
export const EngineProvider = EngineContext.Provider

export const useOptionalEngine = () => {
	return useContext(EngineContext)
}

export const useEngine = () => {
	const engine = useOptionalEngine()

	if (!engine) {
		throw new Error('useEngine doit être utilisé dans un EngineProvider')
	}

	return engine
}
