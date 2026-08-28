import Engine from 'publicodes'

import { DottedName } from '@/domaine/publicodes/DottedName'
import { NomModèle } from '@/domaine/PublicodesSimulationConfig'
import Documentation from '@/pages/documentation/Documentation'

export const documentationRoutesPublicodes = (
	engine: () => Engine<DottedName>,
	nomModèle: NomModèle
) => {
	const DocumentationRoutes = ({ basePath }: { basePath: string }) => (
		<Documentation
			engine={engine()}
			documentationPath={basePath}
			nomModèle={nomModèle}
		/>
	)

	return DocumentationRoutes
}
