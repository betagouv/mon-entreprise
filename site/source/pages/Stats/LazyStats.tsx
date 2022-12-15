import { Suspense, lazy } from 'react'

import MoreInfosOnUs from '@/components/MoreInfosOnUs'
import PageHeader from '@/components/PageHeader'
import Privacy from '@/components/layout/Footer/Privacy'
import Meta from '@/components/utils/Meta'
import { ScrollToTop } from '@/components/utils/Scroll'
import { Emoji } from '@/design-system/emoji'
import { Intro } from '@/design-system/typography/paragraphs'

import { TrackPage } from '../../ATInternetTracking'
import illustrationSvg from './illustration.svg'

const Stats = lazy(() => import('./Stats'))

export default function StatsPage() {
	return (
		<>
			<TrackPage chapter1="informations" name="stats" />
			<Meta
				page="stats"
				title="Statistiques"
				description="	Découvrez nos statistiques d'utilisation mises à jour quotidiennement."
			/>
			<ScrollToTop />
			<PageHeader
				titre={
					<>
						Statistiques <Emoji emoji="📊" />
					</>
				}
				picture={illustrationSvg}
			>
				{' '}
				<Intro>
					Découvrez nos statistiques d'utilisation mises à jour quotidiennement.
					Les données recueillies sont anonymisées.{' '}
					<Privacy label="En savoir plus" />
				</Intro>
			</PageHeader>

			<Suspense fallback={<Intro>Chargement des statistiques...</Intro>}>
				<Stats />
			</Suspense>
			<MoreInfosOnUs />
		</>
	)
}
