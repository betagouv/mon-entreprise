'use client'

import { Trans, useTranslation } from 'react-i18next'

import PageHeader from '@/components/PageHeader'
import { ForceThemeProvider } from '@/components/utils/DarkModeContext'
import { Body, Button, Container, Grid, H2, H3, H4, Intro, Link, Spacing, Strong } from '@/design-system'
import { useDarkMode } from '@/hooks/useDarkMode'

import { styled } from 'styled-components'

export default function Home() {
	const { t } = useTranslation()
	const [darkMode, setDarkMode] = useDarkMode()

	return (
		<>
			<Container>
				<Button
					tracking={{ feature: 'démo next', action: 'bascule mode sombre' }}
					onPress={() => setDarkMode(!darkMode)}
				>
					{darkMode
						? t('app.basculerLight', 'Basculer en mode light')
						: t('app.basculerDark', 'Basculer en mode dark')}
				</Button>

				<PageHeader
					titre={t('landing.title', "L'assistant officiel des entrepreneurs")}
					picture="/images/home-banner-decorative.svg"
				>
					<Intro $xxl>
						<Trans i18nKey="landing.subtitle">
							Des <Strong>assistants et simulateurs</Strong> pour obtenir des{' '}
							<Strong>réponses personnalisées</Strong> à vos questions sur la{' '}
							création et la gestion de votre entreprise.
						</Trans>
					</Intro>

					<Body>
						{t(
							'landing.disclaimer',
							'Tous les simulateurs sur ce site sont maintenus à jour avec les dernières évolutions législatives.'
						)}
					</Body>
				</PageHeader>
			</Container>

			<Container
				forceTheme="dark"
				backgroundColor={(theme) => theme.colors.bases.primary[600]}
			>
				<H2>
					{t(
						'landing.section.explore-status',
						'Explorer les statuts'
					)}
				</H2>

				<Grid
					role="list"
					container
					spacing={4}
				>
					<ForceThemeProvider forceTheme="default">
						<TemporaryCard role="listitem">
							<H3>
								Connaître les statuts disponibles
							</H3>
						</TemporaryCard>

						<TemporaryCard role="listitem">
							<H3>
								Comparer les statuts
							</H3>
						</TemporaryCard>
					</ForceThemeProvider>
				</Grid>

				<Spacing xxl />
			</Container>

			<Container>
				<H2>
					{t(
						'landing.section.by-status',
						'Par statut'
					)}
				</H2>

				<section>
					<H3>
						{t(
							'landing.sub-section.employees-and-employers',
							'Travailleurs salariés et employeurs'
						)}
					</H3>

					<Grid
						container
						spacing={4}
					>
						<TemporaryCard>
							<H4>
								Salarié ou Employeur
							</H4>
						</TemporaryCard>
					</Grid>
				</section>

				<section>
					<H3>
						{t(
							'landing.sub-section.self-employed',
							'Travailleurs indépendants'
						)}
					</H3>

					<Grid
						role="list"
						container
						spacing={4}
					>
						<TemporaryCard role="listitem">
							<H3>
								Auto entrepreneur
							</H3>
						</TemporaryCard>

						<TemporaryCard role="listitem">
							<H3>
								Entreprise individuelle (hors auto entrepreneur)
							</H3>
						</TemporaryCard>

						<TemporaryCard role="listitem">
							<H3>
								EURL
							</H3>
						</TemporaryCard>

						<TemporaryCard role="listitem">
							<H3>
								SAS(U)
							</H3>
						</TemporaryCard>

						<TemporaryCard role="listitem">
							<H3>
								SARL
							</H3>
						</TemporaryCard>
					</Grid>

				</section>
			</Container>

			<Container>
				<H2>
					{t(
						'landing.section.by-occupation',
						'Par profession'
					)}
				</H2>

				<Body>
					{t(
						'landing.sub-section.self-employed-description ',
						"Calculez vos cotisations et votre revenu net après impôt à partir du chiffre d'affaires et inversement"
					)}
				</Body>

				<Grid
					role="list"
					container
					spacing={4}
				>
					<TemporaryCard role="listitem">
						<H3>
							Artisan commerçant
						</H3>
					</TemporaryCard>

					<TemporaryCard role="listitem">
						<H3>
							Progessions libérales non réglementées
						</H3>
					</TemporaryCard>

					<TemporaryCard role="listitem">
						<H3>
							Professions libérales réglementées
						</H3>
					</TemporaryCard>

					<TemporaryCard role="listitem">
						<H3>
							Artiste auteur
						</H3>
					</TemporaryCard>
				</Grid>
			</Container>

			<Container>
				<H2>
					{t(
						'landing.section.other-tools',
						'Autres outils'
					)}
				</H2>

				<Grid
					role="list"
					container
					spacing={4}
				>
					<TemporaryCard role="listitem">
						<H3>
							Activité partielle
						</H3>
					</TemporaryCard>

					<TemporaryCard role="listitem">
						<H3>
							Impôt sur les sociétés
						</H3>
					</TemporaryCard>

					<TemporaryCard role="listitem">
						<H3>
							Dividendes
						</H3>
					</TemporaryCard>

					<TemporaryCard role="listitem">
						<H3>
							Coût de création
						</H3>
					</TemporaryCard>

					<TemporaryCard role="listitem">
						<H3>
							Recherche code APE
						</H3>
					</TemporaryCard>

					<TemporaryCard role="listitem">
						<H3>
							Cessation d'activité
						</H3>
					</TemporaryCard>

					<TemporaryCard role="listitem">
						<H3>
							Réduction générale des cotisations
						</H3>
					</TemporaryCard>

					<TemporaryCard role="listitem">
						<H3>
							Exonération Lodeom
						</H3>
					</TemporaryCard>

					<TemporaryCard role="listitem">
						<H3>
							LMNP/LMP
						</H3>
					</TemporaryCard>
				</Grid>
			</Container>

			<Container>
				<H3 as="h2">
					Rechercher votre entreprise
				</H3>

				<Spacing xxl />
			</Container>

			<Container
				backgroundColor={(theme) =>
					theme.darkMode
						? theme.colors.extended.dark[700]
						: theme.colors.bases.primary[100]
				}
			>
				<StyledAboutGrid container spacing={4}>
					<StyledDecorativeImageHiddenOnMobile item xs={2} md={2}>
						<img
							src="/images/home-about-decorative.svg"
							alt=""
						/>
					</StyledDecorativeImageHiddenOnMobile>

					<Grid item xs={10} md={10}>
						<Trans i18nKey="landing.aboutUs">
							<H2>Qui sommes-nous ?</H2>

							<Body>
								Nous sommes une{' '}
								<Link
									aria-label={t(
										'aria-label.équipe',
										'petite équipe, nouvelle fenêtre'
									)}
									href="https://beta.gouv.fr/startups/mon-entreprise.html#equipe"
								>
									petite équipe
								</Link>{' '}
								autonome et pluridisciplinaire au sein de l’
								<Link
									href="https://www.urssaf.fr"
									aria-label={t(
										'aria-label.urssaf',
										'Urssaf, nouvelle fenêtre'
									)}
								>
									Urssaf
								</Link>
								. Nous avons à cœur d’être au près de vos besoins afin
								d’améliorer en permanence ce site conformément au{' '}
								<Link
									href="https://beta.gouv.fr/manifeste"
									aria-label={t(
										'aria-label.beta-gouv',
										'manifeste beta.gouv.fr, nouvelle fenêtre'
									)}
								>
									manifeste beta.gouv.fr
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
				</StyledAboutGrid>

				<Spacing lg />
			</Container>
		</>
	)
}

const TemporaryCard = styled.article`
	margin: ${({ theme }) => theme.spacings.md};
	padding: ${({ theme }) => theme.spacings.lg};
	border: ${({ theme }) => theme.spacings.xxxs} solid ${({ theme }) => theme.colors.bases.primary[400]};
	border-radius: ${({ theme }) => theme.box.borderRadius};

	background: rgba(255, 255, 255, 0.2);

	h3, h4 {
		margin: 0;
	}
`

const StyledAboutGrid = styled(Grid)`
	align-items: center;
`

const StyledDecorativeImageHiddenOnMobile = styled(Grid)`
	display: none;

	img {
		width: 100%;
		padding-right: 2rem;
		padding-bottom: 1rem;
	}

	@media (min-width: ${({ theme }) => theme.breakpointsWidth.md}) {
		display: block;
	}
`