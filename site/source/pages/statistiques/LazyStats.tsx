import { Suspense, lazy, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { TrackPage } from '@/components/ATInternetTracking'
import MoreInfosOnUs from '@/components/MoreInfosOnUs'
import PageHeader from '@/components/PageHeader'
import Privacy from '@/components/layout/Footer/Privacy'
import Meta from '@/components/utils/Meta'
import { ScrollToTop } from '@/components/utils/Scroll'
import { Message } from '@/design-system'
import { Emoji } from '@/design-system/emoji'
import { Spacing } from '@/design-system/layout'
import { Switch } from '@/design-system/switch'
import { Body, Intro } from '@/design-system/typography/paragraphs'

import illustrationSvg from './illustration.svg'

const Stats = lazy(() => import('./Stats'))

export default function StatsPage() {
	const { t } = useTranslation()
	const [accessibleMode, setAccessibleMode] = useState(false)

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
				picture={illustrationSvg}
			>
				<Intro>
					Découvrez nos statistiques d'utilisation mises à jour quotidiennement.
					Les données recueillies sont anonymisées.{' '}
					<Privacy label="En savoir plus" />
				</Intro>
				<Message type="info" icon>
					<Body>
						Cette page contient de nombreux graphiques qui ne sont pas
						accessibles pour les lecteurs d'écran, nous avons donc mis en place
						un mode d'accessibilité qui les affiche sous forme de tableaux.
					</Body>
					<Switch defaultSelected={accessibleMode} onChange={setAccessibleMode}>
						Activer le mode d'accessibilité sur cette page :
					</Switch>
					<Spacing sm />
				</Message>
			</PageHeader>

			<Suspense fallback={<Intro>Chargement des statistiques...</Intro>}>
				<Stats accessibleMode={accessibleMode} />
			</Suspense>
			<MoreInfosOnUs />
		</>
	)
}
