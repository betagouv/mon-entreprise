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
	H4,
	Intro,
	Link,
	Spacing,
	Strong,
} from '@/design-system'
import { useSimulatorsMetadata } from '@/hooks/useSimulatorsMetadata'

export default function Home() {
	const simulators = useSimulatorsMetadata()
	const { t } = useTranslation()

	return (
		<>
			<Container>
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
				<H2>{t('landing.section.explore-status', 'Explorer les statuts')}</H2>

				<Grid role="list" container spacing={4}>
					<ForceThemeProvider forceTheme="default">
						<SimulateurCard
							{...simulators['choix-statut']}
							role="listitem"
							streched
						/>

						<SimulateurCard
							{...simulators['comparaison-statuts']}
							role="listitem"
							streched
						/>
					</ForceThemeProvider>
				</Grid>

				<Spacing xxl />
			</Container>

			<Container>
				<H2>{t('landing.section.by-status', 'Par statut')}</H2>

				<section>
					<H3>
						{t(
							'landing.sub-section.employees-and-employers',
							'Travailleurs salariés et employeurs'
						)}
					</H3>

					<Grid container spacing={4}>
						<SimulateurCard {...simulators.salarié} streched />
					</Grid>
				</section>

				<section>
					<H3>
						{t(
							'landing.sub-section.self-employed',
							'Travailleurs indépendants'
						)}
					</H3>

					<Grid role="list" container spacing={4}>
						<SimulateurCard
							{...simulators['auto-entrepreneur']}
							role="listitem"
							softBackground
						/>

						<SimulateurCard
							{...simulators['entreprise-individuelle']}
							role="listitem"
							softBackground
						/>

						<SimulateurCard
							{...simulators.eurl}
							role="listitem"
							softBackground
						/>

						<SimulateurCard
							{...simulators.sasu}
							role="listitem"
							softBackground
						/>
					</Grid>
				</section>
			</Container>

			<Container>
				<H2>{t('landing.section.by-occupation', 'Par profession')}</H2>

				<Body>
					{t(
						'landing.sub-section.self-employed-description ',
						"Calculez vos cotisations et votre revenu net après impôt à partir du chiffre d'affaires et inversement"
					)}
				</Body>

				<Grid role="list" container spacing={4}>
					<TemporaryCard role="listitem">
						<H3>Artisan</H3>
					</TemporaryCard>

					<TemporaryCard role="listitem">
						<H3>Commerçant</H3>
					</TemporaryCard>

					<TemporaryCard role="listitem">
						<H3>Professions libérales non réglementées</H3>
					</TemporaryCard>

					<TemporaryCard role="listitem">
						<H3>Professions libérales réglementées</H3>
					</TemporaryCard>

					<SimulateurCard
						{...simulators['artiste-auteur']}
						role="listitem"
						softBackground
					/>
				</Grid>
			</Container>

			<Container>
				<H2>{t('landing.section.other-tools', 'Autres outils')}</H2>

				<Grid role="list" container spacing={4}>
					<SimulateurCard
						{...simulators['activité-partielle']}
						role="listitem"
					/>

					<SimulateurCard {...simulators.is} role="listitem" />

					<SimulateurCard {...simulators.dividendes} role="listitem" />

					<SimulateurCard
						{...simulators['coût-création-entreprise']}
						role="listitem"
					/>

					<SimulateurCard
						{...simulators['recherche-code-ape']}
						role="listitem"
					/>

					<SimulateurCard
						{...simulators['cessation-activité']}
						role="listitem"
					/>

					<SimulateurCard {...simulators.lodeom} role="listitem" />

					<SimulateurCard
						{...simulators['location-de-logement-meublé']}
						role="listitem"
					/>
				</Grid>
			</Container>

			<Container>
				<H3 as="h2">Rechercher votre entreprise</H3>

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
						<img src="/images/home-about-decorative.svg" alt="" />
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
	width: 30%;
	margin: ${({ theme }) => theme.spacings.md};
	padding: ${({ theme }) => theme.spacings.lg};
	border: ${({ theme }) => theme.spacings.xxxs} solid
		${({ theme }) => theme.colors.bases.primary[400]};
	border-radius: ${({ theme }) => theme.box.borderRadius};

	background: darkmagenta;

	h3,
	h4 {
		margin: 0;

		color: white;
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
