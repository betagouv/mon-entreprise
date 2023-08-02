import { createContext, useContext, useState } from 'react'

export function useIsEmbedded(): boolean {
	return useContext(EmbededContext)
}

const EmbededContext = createContext(false)

export function EmbededContextProvider({
	children,
}: {
	children: React.ReactNode
}) {
	const [isEmbedded, setIsEmbedded] = useState(false)
	const isIframePath = document.location.pathname.includes('/iframes/')
	if (isIframePath && !isEmbedded) {
		setIsEmbedded(true)
	}

	return (
		<EmbededContext.Provider value={isEmbedded}>
			{children}
		</EmbededContext.Provider>
	)
}
