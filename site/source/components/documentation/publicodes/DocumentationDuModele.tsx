'use client'

import { NomModèle } from '@/domaine/PublicodesSimulationConfig'
import { useDocumentationPath } from '@/hooks/useDocumentationIndexPath'
import { useEngineFromModèle } from '@/hooks/useEngineFromModèle'

import { PageDeRègle } from './PageDeRegle'

export function DocumentationDuModèle({ nomModèle }: { nomModèle: NomModèle }) {
	const documentationPath = useDocumentationPath(nomModèle)
	const engine = useEngineFromModèle(nomModèle)

	return (
		<PageDeRègle
			documentationPath={documentationPath}
			engine={engine}
			nomModèle={nomModèle}
		/>
	)
}
