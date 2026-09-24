import Engine from 'publicodes'

import { DottedName } from '@/domaine/publicodes/DottedName'
import { NomModèle } from '@/domaine/PublicodesSimulationConfig'

import { Visualiseur } from './Visualiseur'

export const documentationDeRègle = (
	engine: () => Engine<DottedName>,
	nomModèle: NomModèle
) => {
	const DocumentationDeRègle = ({ basePath }: { basePath: string }) => (
		<Visualiseur
			engine={engine()}
			documentationPath={basePath}
			nomModèle={nomModèle}
		/>
	)

	return DocumentationDeRègle
}
