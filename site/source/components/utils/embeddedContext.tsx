import React, {
	createContext,
	ReactNode,
	useContext,
	useEffect,
	useState,
} from 'react'

/*
	Instead of relying on a contextual Provider that activates the
	EmbeddedContext only to iframe paths, we use a global root Context, that
	is modified by side effect when we detect that we are inside an iframe path.

	Its value will not be changed again during the user journey. This means that
	the documentation pages will still be displayed with the Embedded style (no
	header, no footer)
*/
const IsEmbeddedContext = createContext<[boolean, (b: boolean) => void]>([
	false,
	() => {
		throw new Error(
			'useActivateEmbeded cannot be called outside IsEmbededContextProvider'
		)
	},
])

export function IsEmbeddedProvider({
	children,
	isEmbeded = false,
}: {
	children: ReactNode
	isEmbeded?: boolean
}) {
	const state = useState(isEmbeded)

	return (
		<IsEmbeddedContext.Provider value={state}>
			{children}
		</IsEmbeddedContext.Provider>
	)
}

export function useIsEmbedded() {
	return useContext(IsEmbeddedContext)[0]
}

export function IsEmbeded({ children }: { children: React.ReactNode }) {
	const setEmbedded = useContext(IsEmbeddedContext)[1]

	useEffect(() => {
		setEmbedded(true)
	}, [setEmbedded])

	return <IsEmbeddedProvider isEmbeded>{children}</IsEmbeddedProvider>
}
