'use client'

import { Trans, useTranslation } from 'react-i18next'
import { styled } from 'styled-components'

import PageHeader from '@/components/PageHeader'
import { QuiSommesNous } from '@/components/QuiSommesNous'
import { SimulateurCard } from '@/components/SimulateurCard'
import { ForceThemeProvider } from '@/components/utils/DarkModeContext'
import { Body, Container, Grid, H2, H3, Intro, Strong } from '@/design-system'
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

					<ParagrapheEnTête>
						{t(
							'pages.landing.disclaimer',
							'Tous les simulateurs sur ce site sont maintenus à jour avec les dernières évolutions législatives.'
						)}
					</ParagrapheEnTête>
				</PageHeader>
			</Container>

			<ExplorerLesStatutsContainer
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
							stretched
							{...simulators['choix-statut']}
						/>

						<SimulateurCard
							role="listitem"
							stretched
							{...simulators['comparaison-statuts']}
						/>
					</ForceThemeProvider>
				</Grid>
			</ExplorerLesStatutsContainer>

			<ListeDesStatutsEtRechercheEntrepriseContainer>
				<BlocListeDesStatuts>
					<H2>{t('pages.landing.section.by-status', 'Par statut')}</H2>

					<H3>
						{t(
							'pages.landing.sub-section.employees-and-employers',
							'Travailleurs salariés et employeurs'
						)}
					</H3>

					<Grid role="list" container spacing={4}>
						<SimulateurCard
							role="listitem"
							headingLevel="h4"
							stretched
							{...simulators.salarié}
						/>
					</Grid>

					<H3>
						{t(
							'pages.landing.sub-section.self-employed',
							'Travailleurs indépendants'
						)}
					</H3>

					<Grid role="list" container spacing={4}>
						<SimulateurCard
							role="listitem"
							headingLevel="h4"
							darkerBackground
							withoutDescription
							{...simulators['auto-entrepreneur']}
						/>

						<SimulateurCard
							role="listitem"
							headingLevel="h4"
							darkerBackground
							withoutDescription
							{...simulators['entreprise-individuelle']}
							subtitle={t(
								'pages.landing.card-subtitle.ei',
								'(hors auto-entrepreneur)'
							)}
						/>

						<SimulateurCard
							role="listitem"
							headingLevel="h4"
							darkerBackground
							withoutDescription
							{...simulators.eurl}
						/>

						<SimulateurCard
							role="listitem"
							headingLevel="h4"
							darkerBackground
							withoutDescription
							{...simulators.sasu}
						/>
					</Grid>

					<H2 id="par-profession">
						{t('pages.landing.section.by-occupation', 'Par profession')}
					</H2>

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
							withoutDescription
							{...simulators.artisan}
						/>

						<SimulateurCard
							role="listitem"
							darkerBackground
							withoutDescription
							{...simulators.commerçant}
						/>

						<SimulateurCard
							role="listitem"
							darkerBackground
							withoutDescription
							{...simulators['profession-libérale']}
						/>

						<SimulateurCard
							role="listitem"
							darkerBackground
							withoutDescription
							{...simulators['artiste-auteur']}
							subtitle={t(
								'pages.landing.card-subtitle.artiste-auteur',
								'(hors intermittents du spectacle)'
							)}
						/>
					</Grid>

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
				</BlocListeDesStatuts>

				<SearchOrCreate />
			</ListeDesStatutsEtRechercheEntrepriseContainer>

			<QuiSommesNous imgSrc="/images/home-about-decorative.svg" />
		</>
	)
}

const ParagrapheEnTête = styled(Body)`
	padding-bottom: ${({ theme }) => theme.spacings.xl};
`

const ExplorerLesStatutsContainer = styled(Container)`
	padding-bottom: ${({ theme }) => theme.spacings.xxl};
`

const ListeDesStatutsEtRechercheEntrepriseContainer = styled(Container)`
	padding-bottom: ${({ theme }) => theme.spacings.xl};
`

const BlocListeDesStatuts = styled.div`
	display: flex;
	flex-direction: column;
	row-gap: ${({ theme }) => theme.spacings.lg};
	padding-bottom: ${({ theme }) => theme.spacings.lg};
`
