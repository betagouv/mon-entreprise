import Engine from 'publicodes'

import { DottedName } from '@/domaine/publicodes/DottedName'
import { NomModèle } from '@/domaine/PublicodesSimulationConfig'

import { VisualiseurPublicodes } from './VisualiseurPublicodes'

export const documentationRoutesPublicodes = (
	engine: () => Engine<DottedName>,
	nomModèle: NomModèle
) => {
	const DocumentationRoutes = ({ basePath }: { basePath: string }) => (
		<VisualiseurPublicodes
			engine={engine()}
			documentationPath={basePath}
			nomModèle={nomModèle}
		/>
	)

	return DocumentationRoutes
}
