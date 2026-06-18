import {
	createMDXDocumentationFromGlob,
	DocumentationRouter,
	MDXDocumentationIndex,
} from '@/components/documentation'
import { useNavigation } from '@/lib/navigation'
import { useSitePaths } from '@/sitePaths'

const mdxModules = import.meta.glob('./*.mdx', { eager: true })

export const DocumentationHub = () => {
	const { absoluteSitePaths } = useSitePaths()
	const { currentPath } = useNavigation()
	const isIndex = currentPath.endsWith('/documentation')

	const baseUrl =
		absoluteSitePaths.simulateurs['cotisation-maladie-frontalier-suisse']
	const docUrl = baseUrl + '/documentation'

	const { documentations, indexComponent } =
		createMDXDocumentationFromGlob(mdxModules)

	if (!isIndex) {
		return (
			<DocumentationRouter
				documentations={documentations}
				baseUrl={baseUrl}
				docUrl={docUrl}
			/>
		)
	}

	return (
		<MDXDocumentationIndex
			documentations={documentations}
			baseUrl={baseUrl}
			docUrl={docUrl}
			title="Comprendre le calcul de votre cotisation maladie"
			trackingPageName="Documentation cotisation maladie frontalier suisse"
			metaTitle="Documentation - Cotisation maladie frontalier suisse"
			metaDescription="Comprendre le calcul de la cotisation maladie des travailleurs frontaliers en Suisse"
			indexComponent={indexComponent}
		/>
	)
}
