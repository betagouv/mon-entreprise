import { Route, Routes } from 'react-router-dom'

import { DocumentationPage } from '@/design-system'

import { MDXDocumentation } from './createMDXDocumentation'

export interface MDXAutoRouterProps {
	documentations: MDXDocumentation[]
	baseUrl: string
	docUrl: string
}

export const DocumentationRouter = ({
	documentations,
	baseUrl,
	docUrl,
}: MDXAutoRouterProps) => {
	return (
		<Routes>
			{documentations.map(({ path, title, component: Component }) => (
				<Route
					key={path}
					path={path}
					element={
						<DocumentationPage
							title={title}
							backToDocumentationUrl={docUrl}
							backToSimulatorUrl={baseUrl}
						>
							<Component />
						</DocumentationPage>
					}
				/>
			))}
		</Routes>
	)
}
