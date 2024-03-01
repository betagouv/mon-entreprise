import { lazy, Suspense } from 'react'
import { useTranslation } from 'react-i18next'

import { TrackPage } from '@/components/ATInternetTracking'
import MoreInfosOnUs from '@/components/MoreInfosOnUs'
import Meta from '@/components/utils/Meta'
import { ScrollToTop } from '@/components/utils/Scroll'
import { Intro } from '@/design-system/typography/paragraphs'

const Stats = lazy(() => import('./Stats'))

export default function StatsPage() {
	const { t } = useTranslation()

	return (
		<>
			<TrackPage chapter1="informations" name="stats" />
			<Meta
				title={t('stats.title', 'Statistiques')}
				description={t(
					'stats.description',
					"Découvrez nos statistiques d'utilisation mises à jour quotidiennement."
				)}
			/>
			<ScrollToTop />

			<Suspense fallback={<Intro>Chargement des statistiques...</Intro>}>
				<Stats />
			</Suspense>
			<MoreInfosOnUs />
		</>
	)
}
