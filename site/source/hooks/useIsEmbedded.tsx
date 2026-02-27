import { createContext, useContext } from 'react'

import { useNavigation } from '@/lib/navigation'

export function useIsEmbedded(): boolean {
	return useContext(EmbeddedContext)
}

const EmbeddedContext = createContext(false)

export function EmbeddedContextProvider({
	children,
}: {
	children: React.ReactNode
}) {
	const { matchPath } = useNavigation()
	const isEmbedded = matchPath('/iframes/*') !== null

	return (
		<EmbeddedContext.Provider value={isEmbedded}>
			{children}
		</EmbeddedContext.Provider>
	)
}
