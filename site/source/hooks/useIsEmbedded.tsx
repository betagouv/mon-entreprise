import { createContext, useContext, useState } from 'react'
import { useMatch } from 'react-router-dom'

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

	let isIframePath
	try {
		// eslint-disable-next-line react-hooks/rules-of-hooks
		isIframePath = useMatch('/iframes/*')
	} catch {
		isIframePath =
			typeof window !== 'undefined' &&
			window.location.pathname.includes('/iframes/')
	}

	if (isIframePath && !isEmbedded) {
		setIsEmbedded(true)
	}

	return (
		<EmbededContext.Provider value={isEmbedded}>
			{children}
		</EmbededContext.Provider>
	)
}
