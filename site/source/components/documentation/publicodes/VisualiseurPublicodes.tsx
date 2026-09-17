import { getDocumentationSiteMap } from '@publicodes/react-ui'
import Engine from 'publicodes'
import { useMemo } from 'react'

import { FromBottom } from '@/components/ui/animate'
import { DottedName } from '@/domaine/publicodes/DottedName'
import { NomModèle } from '@/domaine/PublicodesSimulationConfig'
import { useNavigation } from '@/lib/navigation'

import DocumentationPageBody from './DocumentationPageBody'

type Props = {
	documentationPath: string
	engine: Engine<DottedName>
	nomModèle: NomModèle
}

export const useRègleDocumentée = ({
	documentationPath,
	engine,
}: Omit<Props, 'nomModèle'>): string | undefined => {
	const { currentPath } = useNavigation()
	const documentationSitePaths = useMemo(
		() => getDocumentationSiteMap({ engine, documentationPath }),
		[engine, documentationPath]
	)

	return documentationSitePaths[decodeURI(currentPath ?? '')]
}

export const VisualiseurPublicodes = ({
	documentationPath,
	engine,
	nomModèle,
}: Props) => {
	const règle = useRègleDocumentée({ documentationPath, engine })

	if (!règle) {
		return null
	}

	return (
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
}
