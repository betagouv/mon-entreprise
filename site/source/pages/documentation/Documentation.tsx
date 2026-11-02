import Engine from 'publicodes'
import { Route, Routes } from 'react-router-dom'

import {
	AccueilDeLaDocumentation,
	PageDeRègle,
} from '@/components/documentation'
import { DottedName } from '@/domaine/publicodes/DottedName'
import { NomModèle } from '@/domaine/PublicodesSimulationConfig'

type Props = {
	documentationPath: string
	engine: Engine<DottedName>
	nomModèle: NomModèle
}

export default function Documentation({
	documentationPath,
	engine,
	nomModèle,
}: Props) {
	return (
		<Routes>
			<Route index element={<AccueilDeLaDocumentation />} />
			<Route
				path="*"
				element={
					<PageDeRègle
						documentationPath={documentationPath}
						engine={engine}
						nomModèle={nomModèle}
					/>
				}
			/>
		</Routes>
	)
}
