import { Trans, useTranslation } from 'react-i18next'

import illustrationSvg from '@/assets/images/illustrations/landing.svg'
import illustration2Svg from '@/assets/images/illustrations/landing2.svg'
import PageHeader from '@/components/PageHeader'
import { ACCUEIL, TrackPage } from '@/components/PianoAnalytics'
import { QuiSommesNous } from '@/components/QuiSommesNous'
import { SimulateurCard } from '@/components/SimulateurCard'
import { ForceThemeProvider } from '@/components/utils/DarkModeContext'
import Meta from '@/components/utils/Meta'
import {
	Button,
	Container,
	Grid,
	H2,
	Intro,
	Spacing,
	Strong,
} from '@/design-system'
import { useSimulatorsMetadata } from '@/hooks/useSimulatorsMetadata'
import { useSitePaths } from '@/sitePaths'

import SearchOrCreate from './SearchOrCreate'

export default function Landing() {
	const simulators = useSimulatorsMetadata()
	const { absoluteSitePaths } = useSitePaths()
	const { t } = useTranslation()

	return (
		<>
			<TrackPage chapter1="informations" name={ACCUEIL} />
			<Meta
				title={t('pages.landing.meta.title', 'Accueil')}
				description={t(
					'pages.landing.description',
					"L'assistant officiel des entrepreneurs"
				)}
				openGraph={{ image: '/logo-share.png' }}
			/>

			<Container>
				<PageHeader
					titre={
						<Trans i18nKey="pages.landing.title">
							L'assistant officiel des entrepreneurs
						</Trans>
					}
					picture={illustrationSvg}
				>
					<Intro $xxl>
						<Trans i18nKey="pages.landing.subtitle">
							Des <Strong>assistants et simulateurs</Strong> pour obtenir des{' '}
							<Strong>réponses personnalisées</Strong> à vos questions sur la{' '}
							création et la gestion de votre entreprise.
						</Trans>
					</Intro>
					<Spacing sm />
					<Grid container>
						<Grid item xs={12}>
							<Button
								size="XL"
								light
								to={absoluteSitePaths.simulateursEtAssistants}
							>
								<Trans i18nKey="pages.landing.choice.simulators.title">
									Découvrir la liste de tous les outils
								</Trans>
							</Button>
						</Grid>
					</Grid>
					<Spacing xxl />
				</PageHeader>
			</Container>
			<Container
				forceTheme="dark"
				backgroundColor={(theme) => theme.colors.bases.primary[600]}
			>
				<Trans i18nKey="pages.landing.outils">
					<H2>Quelques simulateurs de référence</H2>
				</Trans>
				<Grid
					container
					spacing={4}
					style={{
						alignItems: 'stretch',
						justifyContent: 'center',
					}}
				>
					<ForceThemeProvider forceTheme="default">
						<SimulateurCard {...simulators.salarié} />

						<SimulateurCard {...simulators['choix-statut']} />

						<SimulateurCard {...simulators['auto-entrepreneur']} />
					</ForceThemeProvider>
				</Grid>
				<Spacing xxl />
			</Container>
			<Container>
				<SearchOrCreate />
				<Spacing xl />
			</Container>
			<QuiSommesNous imgSrc={illustration2Svg} />
		</>
	)
}
