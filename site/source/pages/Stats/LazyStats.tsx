import Privacy from 'Components/layout/Footer/Privacy'
import MoreInfosOnUs from 'Components/MoreInfosOnUs'
import PageHeader from 'Components/PageHeader'
import Emoji from 'Components/utils/Emoji'
import Meta from 'Components/utils/Meta'
import { ScrollToTop } from 'Components/utils/Scroll'
import { Intro } from 'DesignSystem/typography/paragraphs'
import { lazy, Suspense } from 'react'
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
