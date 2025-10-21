import { getDocumentationSiteMap } from '@publicodes/react-ui'
import Engine from 'publicodes'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'

import { TrackPage } from '@/components/ATInternetTracking'
import { FromBottom } from '@/components/ui/animate'
import Meta from '@/components/utils/Meta'
import ScrollToTop from '@/components/utils/Scroll/ScrollToTop'
import { Spacing } from '@/design-system'

import BackToSimulation from './BackToSimulation'
import DocumentationLanding from './DocumentationLanding'
import DocumentationPageBody from './DocumentationPageBody'
import DocumentationRulesList from './DocumentationRulesList'

export default function Documentation({
	documentationPath,
	engine,
}: {
	documentationPath: string
	engine: Engine
}) {
	const { t } = useTranslation()
	const location = useLocation()
	const pathname = decodeURI(location?.pathname ?? '')
	const documentationSitePaths = useMemo(
		() => getDocumentationSiteMap({ engine, documentationPath }),
		[engine, documentationPath]
	)

	return (
		<Routes>
			<Route index element={<DocumentationLanding />} />
			{IS_DEVELOPMENT && (
				<Route path="dev" element={<DocumentationRulesList />} />
			)}
			<Route
				path="*"
				element={
					!documentationSitePaths[pathname] ? (
						<Navigate to="/404" replace />
					) : (
						<>
							<Meta
								title={t('pages.documentation.meta.title', 'Documentation')}
								description={t(
									'pages.documentation.meta.description',
									'Documentation des règles de calcul de nos simulateurs et assistants'
								)}
							/>
							<div id="mobile-menu-portal-id" />
							<FromBottom>
								<TrackPage
									chapter1="documentation"
									name={documentationSitePaths[pathname]}
								/>
								<ScrollToTop key={pathname} />
								<BackToSimulation />
								<Spacing xl />
								<DocumentationPageBody
									engine={engine}
									documentationPath={documentationPath}
								/>
							</FromBottom>
						</>
					)
				}
			/>
		</Routes>
	)
}
