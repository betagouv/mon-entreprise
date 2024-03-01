import { lazy, Suspense } from 'react'
import { useTranslation } from 'react-i18next'

import { TrackPage } from '@/components/ATInternetTracking'
import Privacy from '@/components/layout/Footer/Privacy'
import MoreInfosOnUs from '@/components/MoreInfosOnUs'
import PageHeader from '@/components/PageHeader'
import Meta from '@/components/utils/Meta'
import { ScrollToTop } from '@/components/utils/Scroll'
import { Emoji } from '@/design-system/emoji'
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
			<PageHeader
				titre={
					<>
						Statistiques <Emoji emoji="📊" />
					</>
				}
			>
				<Intro>
					Découvrez nos statistiques d'utilisation mises à jour quotidiennement.
					<br />
					Les données recueillies sont anonymisées.{' '}
					<Privacy label="En savoir plus." />
				</Intro>
			</PageHeader>

			<Suspense fallback={<Intro>Chargement des statistiques...</Intro>}>
				<Stats />
			</Suspense>
			<MoreInfosOnUs />
		</>
	)
}
