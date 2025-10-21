import { lazy, Suspense } from 'react'
import { useTranslation } from 'react-i18next'

import { TrackPage } from '@/components/ATInternetTracking'
import Loader from '@/components/utils/Loader'
import Meta from '@/components/utils/Meta'
import { Body, H1 } from '@/design-system'

const LazySearchRules = lazy(() => import('@/components/search/SearchRules'))

export default function DocumentationLanding() {
	const { t } = useTranslation()

	return (
		<>
			<TrackPage chapter1="documentation" name="accueil" />
			<Meta
				title={t('pages.documentation.meta.title', 'Documentation')}
				description={t(
					'pages.documentation.meta.descriptionBis',
					'Explorez toutes les règles de la documentation'
				)}
			/>
			<H1>{t('pages.documentation.title', 'Documentation')}</H1>
			<Body>
				{t(
					'pages.documentation.body',
					'Explorez toutes les règles de la documentation'
				)}
			</Body>
			<Suspense fallback={<Loader />}>
				<LazySearchRules />
			</Suspense>
		</>
	)
}
