import Engine from 'publicodes'

import { TrackPage } from '@/components/PianoAnalytics'
import { FromBottom } from '@/components/ui/animate'
import BrowserOnly from '@/components/utils/BrowserOnly'
import { DottedName } from '@/domaine/publicodes/DottedName'
import { NomModèle } from '@/domaine/PublicodesSimulationConfig'

import DocumentationPageBody from './DocumentationPageBody'

type Props = {
	documentationPath: string
	engine: Engine<DottedName>
	nomModèle: NomModèle
	règle?: string
}

export const Visualiseur = ({
	documentationPath,
	engine,
	nomModèle,
	règle,
}: Props) => (
	<>
		{règle && <TrackPage chapter1="documentation" name={règle} />}
		<div id="mobile-menu-portal-id" />
		{/* `RulesNav` de @publicodes/react-ui lit `matchMedia` pendant le rendu
		(1.10.4 incluse) : sous le point de rupture `lg`, le serveur ne peut pas
		s'accorder avec le client. */}
		<BrowserOnly>
			<FromBottom>
				<DocumentationPageBody
					engine={engine}
					documentationPath={documentationPath}
					nomModèle={nomModèle}
				/>
			</FromBottom>
		</BrowserOnly>
	</>
)
