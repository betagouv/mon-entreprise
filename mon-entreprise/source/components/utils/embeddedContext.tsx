import { createContext, ReactNode, useContext, useState } from 'react'
import { useEffect } from 'react'

const IsEmbeddedContext = createContext<[boolean, (b: boolean) => void]>([
	false,
	() => {
		throw new Error(
			'useActivateEmbeded cannot be called outside IsEmbededContextProvider'
		)
	},
])

export function IsEmbeddedProvider({ children }: { children: ReactNode }) {
	const state = useState(false)
	return (
		<IsEmbeddedContext.Provider value={state}>
			{children}
		</IsEmbeddedContext.Provider>
	)
}

export function useSetEmbedded() {
	const setEmbedded = useContext(IsEmbeddedContext)[1]
	setEmbedded(true)
	// useEffect(() => setEmbedded(true), [setEmbedded])
}

export function useIsEmbedded() {
	return useContext(IsEmbeddedContext)[0]
}
