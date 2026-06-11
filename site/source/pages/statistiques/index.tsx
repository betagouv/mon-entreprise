import { lazy, Suspense } from 'react'
import { useTranslation } from 'react-i18next'

import MoreInfosOnUs from '@/components/MoreInfosOnUs'
import { TrackPage } from '@/components/PianoAnalytics'
import Meta from '@/components/utils/Meta'
import ScrollToTop from '@/components/utils/Scroll/ScrollToTop'
import { H1, Intro } from '@/design-system'

import DemandeUtilisateurs from './DemandesUtilisateurs'

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

			<Suspense
				fallback={
					<>
						<H1>Statistiques 📊</H1>
						<Intro>Chargement des statistiques...</Intro>
					</>
				}
			>
				<Stats />
			</Suspense>
			<DemandeUtilisateurs />
			<MoreInfosOnUs />
		</>
	)
}
