import {
	createMDXDocumentationFromGlob,
	DocumentationRouter,
	MDXDocumentationIndex,
} from '@/components/documentation/index'
import { useNavigation } from '@/lib/navigation/index'
import { useSitePaths } from '@/sitePaths'

import IndexDocumentation from './indexDocumentation'
import MicroBicDocumentation from './microBicDocumentation'

const mdxModules = {
	'./index.mdx': IndexDocumentation,
	'./micro-bic.mdx': MicroBicDocumentation,
}

export const DocumentationHub = () => {
	const { absoluteSitePaths } = useSitePaths()
	const { currentPath } = useNavigation()
	const isIndex = currentPath.endsWith('/documentation')

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
