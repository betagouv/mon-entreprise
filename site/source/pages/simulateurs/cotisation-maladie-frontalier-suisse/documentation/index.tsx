import { useTranslation } from 'react-i18next'

import {
	createMDXDocumentationFromGlob,
	DocumentationRouter,
	MDXDocumentationIndex,
} from '@/components/documentation'
import { useNavigation } from '@/lib/navigation'
import { useSitePaths } from '@/sitePaths'

const mdxModules = import.meta.glob('./*.mdx', { eager: true })

export const DocumentationHub = () => {
	const { t, i18n } = useTranslation()
	const { absoluteSitePaths } = useSitePaths()
	const { currentPath } = useNavigation()
	const isIndex = currentPath.endsWith('/documentation')

	const baseUrl =
		absoluteSitePaths.simulateurs['cotisation-maladie-frontalier-suisse']
	const docUrl = baseUrl + '/documentation'

	const { documentations, indexComponent } = createMDXDocumentationFromGlob(
		mdxModules,
		i18n.language
	)

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
			title={t(
				'pages.simulateurs.cotisation-maladie-frontalier-suisse.documentation.titre',
				'Comprendre le calcul de votre cotisation maladie'
			)}
			trackingPageName="Documentation cotisation maladie frontalier suisse"
			metaTitle={t(
				'pages.simulateurs.cotisation-maladie-frontalier-suisse.documentation.meta-titre',
				'Documentation - Cotisation maladie frontalier suisse'
			)}
			metaDescription={t(
				'pages.simulateurs.cotisation-maladie-frontalier-suisse.documentation.meta-description',
				'Comprendre le calcul de la cotisation maladie des travailleur·euses frontalier·ères en Suisse'
			)}
			indexComponent={indexComponent}
		/>
	)
}
