import {
	createMDXDocumentationFromGlob,
	DocumentationRouter,
	MDXDocumentationIndex,
} from '@/components/documentation'
import { useCurrentPath } from '@/lib/navigation'
import { useSitePaths } from '@/sitePaths'

const mdxModules = import.meta.glob('./*.mdx', { eager: true })

export const DocumentationHub = () => {
	const { absoluteSitePaths } = useSitePaths()
	const pathname = useCurrentPath()
	const isIndex = pathname.endsWith('/documentation')

	const baseUrl = absoluteSitePaths.simulateurs['location-de-logement-meublé']
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
			title="Comprendre la location de meublé courte durée"
			trackingPageName="Documentation location meublée"
			metaTitle="Documentation - Location de meublé"
			metaDescription="Comprendre les régimes fiscaux et sociaux de la location meublée"
			indexComponent={indexComponent}
		/>
	)
}
