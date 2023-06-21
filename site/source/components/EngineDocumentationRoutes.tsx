import { Route, Routes, useNavigate } from 'react-router-dom'

import Popover from '@/design-system/popover/Popover'
import Documentation from '@/pages/Documentation'
import { EngineComparison } from '@/pages/simulateurs/comparaison-statuts/components/Comparateur'

export function EngineDocumentationRoutes({
	namedEngines,
	basePath,
}: {
	namedEngines: EngineComparison
	basePath: string
}) {
	const navigate = useNavigate()

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
								<Documentation
									engine={engine}
									documentationPath={`${basePath}/${name}`}
								/>
							</Popover>
						</div>
					}
				/>
			))}
		</Routes>
	)
}
