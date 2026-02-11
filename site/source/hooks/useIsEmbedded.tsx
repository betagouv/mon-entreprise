import { createContext, useContext } from 'react'

import { useNavigation } from '@/lib/navigation'

export function useIsEmbedded(): boolean {
	return useContext(EmbededContext)
}

const EmbededContext = createContext(false)

export function EmbededContextProvider({
	children,
}: {
	children: React.ReactNode
}) {
	const { matchPath } = useNavigation()
	const isEmbedded = matchPath('/iframes/*') !== null

	return (
		<EmbededContext.Provider value={isEmbedded}>
			{children}
		</EmbededContext.Provider>
	)
}
