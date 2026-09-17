import { getDocumentationSiteMap } from '@publicodes/react-ui'
import Engine from 'publicodes'
import { useMemo } from 'react'

import { DottedName } from '@/domaine/publicodes/DottedName'
import { useNavigation } from '@/lib/navigation'

export const useRègleDocumentée = ({
	documentationPath,
	engine,
}: {
	documentationPath: string
	engine: Engine<DottedName>
}): string | undefined => {
	const { currentPath } = useNavigation()
	const documentationSitePaths = useMemo(
		() => getDocumentationSiteMap({ engine, documentationPath }),
		[engine, documentationPath]
	)

	return documentationSitePaths[decodeURI(currentPath ?? '')]
}
