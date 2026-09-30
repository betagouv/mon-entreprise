import Engine from 'publicodes'

import { DottedName } from '@/domaine/publicodes/DottedName'
import { NomModèle } from '@/domaine/PublicodesSimulationConfig'

import { useRègleDuCheminCourant } from './useRegleDuCheminCourant'
import { Visualiseur } from './Visualiseur'

export const documentationDeRègle = (
	getEngine: () => Engine<DottedName>,
	nomModèle: NomModèle
) => {
	const DocumentationDeRègle = ({ basePath }: { basePath: string }) => {
		const engine = getEngine()
		const règle = useRègleDuCheminCourant({
			documentationPath: basePath,
			engine,
		})

		return (
			<Visualiseur
				engine={engine}
				documentationPath={basePath}
				nomModèle={nomModèle}
				règle={règle}
			/>
		)
	}

	return DocumentationDeRègle
}
