import { createContext, PropsWithChildren, useContext } from 'react'

const BasePathContext = createContext<string | null>(null)

export const DocumentationBasePathProvider = ({
	basePath,
	children,
}: PropsWithChildren<{ basePath: string }>) => (
	<BasePathContext.Provider value={basePath}>
		{children}
	</BasePathContext.Provider>
)

export const useDocumentationBasePath = () => {
	const basePath = useContext(BasePathContext)

	if (basePath === null) {
		throw new Error(
			'Une documentation doit être affichée dans un DocumentationBasePathProvider'
		)
	}

	return basePath
}
