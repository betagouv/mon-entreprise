import { Route, Routes, useNavigate } from 'react-router-dom'

import Popover from '@/design-system/popover/Popover'
import Documentation from '@/pages/Documentation'
import { EngineComparison } from '@/pages/simulateurs/comparaison-statuts/components/Comparateur'
import { useSitePaths } from '@/sitePaths'

export function EngineDocumentationRoutes({
	namedEngines,
}: {
	namedEngines: EngineComparison
}) {
	const navigate = useNavigate()
	const { absoluteSitePaths } = useSitePaths()

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
									navigate(absoluteSitePaths.simulateurs.comparaison, {
										replace: true,
									})
								}}
							>
								<Documentation
									engine={engine}
									documentationPath={`/simulateurs/comparaison-régimes-sociaux/${name}`}
								/>
							</Popover>
						</div>
					}
				/>
			))}
		</Routes>
	)
}
