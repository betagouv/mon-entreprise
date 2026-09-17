import Engine from 'publicodes'

import { FromBottom } from '@/components/ui/animate'
import { DottedName } from '@/domaine/publicodes/DottedName'
import { NomModèle } from '@/domaine/PublicodesSimulationConfig'

import DocumentationPageBody from './DocumentationPageBody'

type Props = {
	documentationPath: string
	engine: Engine<DottedName>
	nomModèle: NomModèle
}

export const VisualiseurPublicodes = ({
	documentationPath,
	engine,
	nomModèle,
}: Props) => (
	<>
		<div id="mobile-menu-portal-id" />
		<FromBottom>
			<DocumentationPageBody
				engine={engine}
				documentationPath={documentationPath}
				nomModèle={nomModèle}
			/>
		</FromBottom>
	</>
)
