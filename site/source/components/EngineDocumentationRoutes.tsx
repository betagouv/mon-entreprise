import Engine from 'publicodes'
import { Route, Routes } from 'react-router-dom'

import {
	useRègleDocumentée,
	VisualiseurPublicodes,
} from '@/components/documentation'
import { Popover } from '@/design-system'
import { DottedName } from '@/domaine/publicodes/DottedName'
import { useNavigation } from '@/lib/navigation'
import { EngineComparison } from '@/pages/simulateurs/comparaison-statuts/EngineComparison'

export function EngineDocumentationRoutes({
	namedEngines,
	basePath,
}: {
	namedEngines: EngineComparison
	basePath: string
}) {
	return (
		<Routes>
			{namedEngines.map(({ engine, name }) => (
				<Route
					key={name}
					path={`${name}/*`}
					element={
						<ModaleDeDocumentation
							engine={engine}
							documentationPath={`${basePath}/${name}`}
							basePath={basePath}
						/>
					}
				/>
			))}
		</Routes>
	)
}

const ModaleDeDocumentation = ({
	documentationPath,
	engine,
	basePath,
}: {
	documentationPath: string
	engine: Engine<DottedName>
	basePath: string
}) => {
	const { navigate } = useNavigation()
	const règle = useRègleDocumentée({ documentationPath, engine })

	if (!règle) {
		return null
	}

	return (
		<div>
			<Popover
				isOpen
				isDismissable
				onClose={() => {
					navigate(basePath, { replace: true })
				}}
			>
				<VisualiseurPublicodes
					engine={engine}
					documentationPath={documentationPath}
					nomModèle="modele-social"
				/>
			</Popover>
		</div>
	)
}
