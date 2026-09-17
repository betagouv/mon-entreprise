import { Route, Routes } from 'react-router-dom'

import { VisualiseurPublicodes } from '@/components/documentation'
import { Popover } from '@/design-system'
import { useNavigation } from '@/lib/navigation'
import { EngineComparison } from '@/pages/simulateurs/comparaison-statuts/EngineComparison'

export function EngineDocumentationRoutes({
	namedEngines,
	basePath,
}: {
	namedEngines: EngineComparison
	basePath: string
}) {
	const { navigate } = useNavigation()

	return (
		<Routes>
			{namedEngines.map(({ engine, name }) => (
				<Route
					key={name}
					path={`${name}/*`}
					element={
						<div>
							<Popover
								isOpen
								isDismissable
								onClose={() => {
									navigate(basePath, {
										replace: true,
									})
								}}
							>
								<VisualiseurPublicodes
									engine={engine}
									documentationPath={`${basePath}/${name}`}
									nomModèle="modele-social"
								/>
							</Popover>
						</div>
					}
				/>
			))}
		</Routes>
	)
}
