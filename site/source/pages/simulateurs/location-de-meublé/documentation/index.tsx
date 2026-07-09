import { useTranslation } from 'react-i18next'

import {
	createMDXDocumentationFromGlob,
	DocumentationRouter,
	MDXDocumentationIndex,
} from '@/components/documentation'
import { useNavigation } from '@/lib/navigation'
import { parseLangue } from '@/locales/langue'
import { useSitePaths } from '@/sitePaths'

const mdxModules = import.meta.glob('./*.mdx', { eager: true })

export const DocumentationHub = () => {
	const { i18n } = useTranslation()
	const { absoluteSitePaths } = useSitePaths()
	const { currentPath } = useNavigation()
	const isIndex = currentPath.endsWith('/documentation')

	const baseUrl = absoluteSitePaths.simulateurs['location-de-logement-meublé']
	const docUrl = baseUrl + '/documentation'

	const { documentations, indexComponent, indexMetadata } =
		createMDXDocumentationFromGlob(mdxModules, parseLangue(i18n.language))

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
			title={indexMetadata?.title ?? ''}
			trackingPageName="Documentation location meublée"
			metaTitle={indexMetadata?.metaTitle ?? ''}
			metaDescription={indexMetadata?.description ?? ''}
			indexComponent={indexComponent}
		/>
	)
}
