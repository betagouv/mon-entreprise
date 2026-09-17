import Engine from 'publicodes'

import { DottedName } from '@/domaine/publicodes/DottedName'
import { NomModèle } from '@/domaine/PublicodesSimulationConfig'

import { VisualiseurPublicodes } from './VisualiseurPublicodes'

export const documentationDeRèglePublicodes = (
	engine: () => Engine<DottedName>,
	nomModèle: NomModèle
) => {
	const DocumentationDeRègle = ({ basePath }: { basePath: string }) => (
		<VisualiseurPublicodes
			engine={engine()}
			documentationPath={basePath}
			nomModèle={nomModèle}
		/>
	)

	return DocumentationDeRègle
}
