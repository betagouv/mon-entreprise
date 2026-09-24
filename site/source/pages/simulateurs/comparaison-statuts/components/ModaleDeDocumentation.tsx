import { useDocumentationBasePath } from '@/components/documentation'
import { useComparateur } from '@/contextes/comparateur'
import { Popover } from '@/design-system'
import { useNavigation } from '@/lib/navigation'

export const ModaleDeDocumentation = () => {
	const basePath = useDocumentationBasePath()
	const { documentationsDeRègle } = useComparateur()
	const { currentPath, matchPath, navigate } = useNavigation()

	const cheminDemandé = decodeURI(currentPath)
	const documentationDemandée = documentationsDeRègle.find(
		({ étiquette }) =>
			matchPath(`${basePath}/${étiquette}/*`, cheminDemandé)?.params['*']
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
			<documentationDemandée.DocumentationDeRègle
				basePath={`${basePath}/${documentationDemandée.étiquette}`}
			/>
		</Popover>
	)
}
