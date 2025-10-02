import { Trans, useTranslation } from 'react-i18next'
import { styled } from 'styled-components'

import { ACCUEIL, TrackPage } from '@/components/ATInternetTracking'
import PageHeader from '@/components/PageHeader'
import { SimulateurCard } from '@/components/SimulateurCard'
import { ForceThemeProvider } from '@/components/utils/DarkModeContext'
import Meta from '@/components/utils/Meta'
import {
	Body,
	Button,
	Container,
	Grid,
	H2,
	Intro,
	Link,
	Spacing,
	Strong,
} from '@/design-system'
import useSimulatorsData from '@/hooks/useSimulatorsData'
import { useSitePaths } from '@/sitePaths'

import illustrationSvg from './illustration.svg'
import illustration2Svg from './illustration2.svg'
import SearchOrCreate from './SearchOrCreate'

export default function Landing() {
	const simulators = useSimulatorsData()
	const { absoluteSitePaths } = useSitePaths()
	const { t } = useTranslation()

	return (
		<>
			<TrackPage chapter1="informations" name={ACCUEIL} />
			<Meta
				title={t('landing.meta.title', 'Accueil')}
				description={t(
					'landing.description',
					"L'assistant officiel des entrepreneurs"
				)}
				ogImage="/logo-share.png"
			/>

			<Container>
				<PageHeader
					titre={
						<Trans i18nKey="landing.title">
							L'assistant officiel des entrepreneurs
						</Trans>
					}
					picture={illustrationSvg}
				>
					<Intro $xxl>
						<Trans i18nKey="landing.subtitle">
							Des assistants et simulateurs pour obtenir des{' '}
							<Strong>réponses personnalisées</Strong> à vos questions sur la{' '}
							<Strong>création et la gestion</Strong> de votre entreprise.
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
								<Trans i18nKey="landing.choice.simulators.title">
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
				<Trans i18nKey="landing.outils">
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
			<Container
				backgroundColor={(theme) =>
					theme.darkMode
						? theme.colors.extended.dark[700]
						: theme.colors.bases.primary[100]
				}
			>
				{' '}
				<Spacing lg />
				<Grid
					container
					style={{
						alignItems: 'flex-end',
					}}
				>
					<HideOnMobile item xs={2} md={2}>
						<img
							src={illustration2Svg}
							style={{
								width: '100%',
								paddingRight: '2rem',
								paddingBottom: '1rem',
							}}
							alt=""
						/>
					</HideOnMobile>
					<Grid item md={10}>
						<Trans i18nKey="landing.aboutUs">
							<H2>Qui sommes-nous ?</H2>

							<Body>
								Nous sommes une petite{' '}
								<Link
									aria-label="équipe, accéder à notre page de présentation d'équipe, nouvelle fenêtre"
									href="https://beta.gouv.fr/startups/mon-entreprise.html#equipe"
								>
									équipe
								</Link>{' '}
								autonome et pluridisciplinaire au sein de{' '}
								<Link
									href="https://www.urssaf.fr"
									aria-label="l'URSSAF, accéder au site urssaf.fr, nouvelle fenêtre"
								>
									l’Urssaf
								</Link>
								. Nous avons à cœur d’être au près de vos besoins afin
								d’améliorer en permanence ce site conformément à l'approche{' '}
								<Link
									href="https://beta.gouv.fr/manifeste"
									aria-label="beta.gouv.fr, accéder au site beta.gouv.fr, nouvelle fenêtre"
								>
									beta.gouv.fr
								</Link>
								.
							</Body>

							<Body>
								Nous avons développé ce site pour accompagner les créateurs
								d’entreprise dans le développement de leur activité.
							</Body>

							<Body>
								Notre objectif est de lever toutes les incertitudes vis à vis de
								l’administration afin que vous puissiez vous concentrer sur ce
								qui compte : votre activité.
							</Body>
						</Trans>
					</Grid>
				</Grid>
				<Spacing lg />
			</Container>
		</>
	)
}

const HideOnMobile = styled(Grid)`
	display: none;

	@media (min-width: ${({ theme }) => theme.breakpointsWidth.md}) {
		display: block;
	}
`
