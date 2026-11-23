import { createContext, useContext } from 'react'

export const LienVersLaDocumentationContext = createContext(true)

export function LienVersLaDocumentationProvider({
	children,
	lienVersLaDocumentation = true,
}: {
	children: React.ReactNode
	lienVersLaDocumentation?: boolean
}) {
	return (
		<LienVersLaDocumentationContext.Provider value={lienVersLaDocumentation}>
			{children}
		</LienVersLaDocumentationContext.Provider>
	)
}

export function useLienVersLaDocumentation(): boolean {
	return useContext(LienVersLaDocumentationContext)
}
