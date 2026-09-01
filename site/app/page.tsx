'use client'

import { Trans, useTranslation } from 'react-i18next'
import { styled } from 'styled-components'

import PageHeader from '@/components/PageHeader'
import { SimulateurCard } from '@/components/SimulateurCard'
import { ForceThemeProvider } from '@/components/utils/DarkModeContext'
import {
	Body,
	Container,
	Grid,
	H2,
	H3,
	Intro,
	Link,
	Strong,
} from '@/design-system'
import { useSimulatorsMetadata } from '@/hooks/useSimulatorsMetadata'
import SearchOrCreate from '@/pages/_landing/SearchOrCreate'

export default function Home() {
	const simulators = useSimulatorsMetadata()
	const { t } = useTranslation()

	return (
		<>
			<Container>
				<PageHeader
					titre={t(
						'pages.landing.title',
						"L'assistant officiel des entrepreneurs"
					)}
					picture="/images/home-banner-decorative.svg"
				>
					<Intro $xxl>
						<Trans i18nKey="pages.landing.subtitle">
							Des <Strong>assistants et simulateurs</Strong> pour obtenir des{' '}
							<Strong>réponses personnalisées</Strong> à vos questions sur la{' '}
							création et la gestion de votre entreprise.
						</Trans>
					</Intro>

					<Body>
						{t(
							'pages.landing.disclaimer',
							'Tous les simulateurs sur ce site sont maintenus à jour avec les dernières évolutions législatives.'
						)}
					</Body>
				</PageHeader>
			</Container>

			<ContainerWithXxlPaddingBottom
				forceTheme="dark"
				backgroundColor={(theme) => theme.colors.bases.primary[600]}
			>
				<H2>
					{t('pages.landing.section.explore-status', 'Explorer les statuts')}
				</H2>

				<Grid role="list" container spacing={4}>
					<ForceThemeProvider forceTheme="default">
						<SimulateurCard
							role="listitem"
							streched
							{...simulators['choix-statut']}
						/>

						<SimulateurCard
							role="listitem"
							streched
							{...simulators['comparaison-statuts']}
						/>
					</ForceThemeProvider>
				</Grid>
			</ContainerWithXxlPaddingBottom>

			<Container>
				<H2>{t('pages.landing.section.by-status', 'Par statut')}</H2>

				<section>
					<H3>
						{t(
							'pages.landing.sub-section.employees-and-employers',
							'Travailleurs salariés et employeurs'
						)}
					</H3>

					<Grid container spacing={4}>
						<SimulateurCard streched {...simulators.salarié} />
					</Grid>
				</section>

				<section>
					<H3>
						{t(
							'pages.landing.sub-section.self-employed',
							'Travailleurs indépendants'
						)}
					</H3>

					<Grid role="list" container spacing={4}>
						<SimulateurCard
							role="listitem"
							darkerBackground
							sansDescription
							{...simulators['auto-entrepreneur']}
						/>

						<SimulateurCard
							role="listitem"
							darkerBackground
							sansDescription
							{...simulators['entreprise-individuelle']}
							précision={t(
								'pages.landing.précision.ei',
								'(hors auto-entrepreneur)'
							)}
						/>

						<SimulateurCard
							role="listitem"
							darkerBackground
							sansDescription
							{...simulators.eurl}
						/>

						<SimulateurCard
							role="listitem"
							darkerBackground
							sansDescription
							{...simulators.sasu}
						/>
					</Grid>
				</section>
			</Container>

			<Container>
				<H2>{t('pages.landing.section.by-occupation', 'Par profession')}</H2>

				<Body>
					{t(
						'pages.landing.sub-section.self-employed-description',
						"Calculez vos cotisations et votre revenu net après impôt à partir du chiffre d'affaires et inversement"
					)}
				</Body>

				<Grid role="list" container spacing={4}>
					<SimulateurCard
						role="listitem"
						darkerBackground
						sansDescription
						{...simulators.artisan}
					/>

					<SimulateurCard
						role="listitem"
						darkerBackground
						sansDescription
						{...simulators.commerçant}
					/>

					<SimulateurCard
						role="listitem"
						darkerBackground
						sansDescription
						{...simulators['profession-libérale']}
					/>

					<SimulateurCard
						role="listitem"
						darkerBackground
						sansDescription
						{...simulators['artiste-auteur']}
						précision={t(
							'pages.landing.précision.artiste-auteur',
							'(hors intermittents du spectacle)'
						)}
					/>
				</Grid>
			</Container>

			<ContainerWithLgPaddingBottom>
				<H2>{t('pages.landing.section.other-tools', 'Autres outils')}</H2>

				<Grid role="list" container spacing={4}>
					<SimulateurCard
						role="listitem"
						{...simulators['activité-partielle']}
					/>

					<SimulateurCard role="listitem" {...simulators.is} />

					<SimulateurCard role="listitem" {...simulators.dividendes} />

					<SimulateurCard
						role="listitem"
						{...simulators['coût-création-entreprise']}
					/>

					<SimulateurCard
						role="listitem"
						{...simulators['recherche-code-ape']}
					/>

					<SimulateurCard
						role="listitem"
						{...simulators['cessation-activité']}
					/>

					<SimulateurCard role="listitem" {...simulators.lodeom} />

					<SimulateurCard
						role="listitem"
						{...simulators['location-de-logement-meublé']}
					/>
				</Grid>
			</ContainerWithLgPaddingBottom>

			<ContainerWithXxlPaddingBottom>
				<SearchOrCreate />
			</ContainerWithXxlPaddingBottom>

			<ContainerWithLgPaddingBottom
				backgroundColor={(theme) =>
					theme.darkMode
						? theme.colors.extended.dark[700]
						: theme.colors.bases.primary[100]
				}
			>
				<StyledAboutGrid container spacing={4}>
					<StyledDecorativeImageHiddenOnMobile item xs={2} md={2}>
						<img src="/images/home-about-decorative.svg" alt="" />
					</StyledDecorativeImageHiddenOnMobile>

					<Grid item xs={10} md={10}>
						<Trans i18nKey="pages.landing.aboutUs">
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
			</ContainerWithLgPaddingBottom>
		</>
	)
}

const ContainerWithXxlPaddingBottom = styled(Container)`
	padding-bottom: ${({ theme }) => theme.spacings.xxl};
`

const ContainerWithLgPaddingBottom = styled(Container)`
	padding-bottom: ${({ theme }) => theme.spacings.lg};
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
