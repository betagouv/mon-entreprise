import { useDocumentationBasePath } from '@/components/documentation/DocumentationBasePathProvider'
import { useComparateur } from '@/contextes/comparateur'
import { Popover } from '@/design-system'
import { useNavigation } from '@/lib/navigation'

export const DocumentationRoutes = () => {
	const basePath = useDocumentationBasePath()
	const { documentations } = useComparateur()
	const { currentPath, matchPath, navigate } = useNavigation()

	const cheminDemandé = decodeURI(currentPath)
	const documentationDemandée = documentations.find(({ étiquette }) =>
		matchPath(`${basePath}/${étiquette}/*`, cheminDemandé)
	)

	if (!documentationDemandée) {
		return null
	}

	return (
		<Popover
			isOpen
			isDismissable
			onClose={() => {
				navigate(basePath, { replace: true })
			}}
		>
			<documentationDemandée.DocumentationRoutes
				basePath={`${basePath}/${documentationDemandée.étiquette}`}
			/>
		</Popover>
	)
}
