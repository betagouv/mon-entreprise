import { Trans, useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { TrackPage } from '@/components/ATInternetTracking'
import PageHeader from '@/components/PageHeader'
import { FromBottom } from '@/components/ui/animate'
import Meta from '@/components/utils/Meta'
import { Message } from '@/design-system'
import { Button } from '@/design-system/buttons'
import { ClockIcon } from '@/design-system/icons'
import { Container, Grid, Spacing } from '@/design-system/layout'
import { H3 } from '@/design-system/typography/heading'
import { Body, Intro, SmallBody } from '@/design-system/typography/paragraphs'
import useSimulatorsData from '@/hooks/useSimulatorsData'
import { SimulateurCard } from '@/pages/simulateurs-et-assistants'
import { useSitePaths } from '@/sitePaths'

import { stepOrder } from './_components/Navigation'
import créerSvg from './_illustrations/créer.svg'

export default function AccueilChoixStatut() {
	const { t } = useTranslation()
	const { absoluteSitePaths, relativeSitePaths } = useSitePaths()
	const simulateurData = useSimulatorsData()

	return (
		<FromBottom>
			<TrackPage name="accueil" />
			<Meta
				title={t('choix-statut.meta.title', 'Choisir votre statut')}
				description={t('choix-statut.meta.description', 'Choisir votre statut')}
				ogImage={créerSvg}
			/>

			<PageHeader
				titre={
					<Trans i18nKey="choix-statut.home.title">Choisir votre statut</Trans>
				}
				picture={créerSvg}
			>
				<Intro>
					<Trans i18nKey="choix-statut.home.intro">
						La première étape consiste à choisir un{' '}
						<Bold>statut juridique adapté à votre activité</Bold>. Les démarches
						administratives changent en fonction de ce dernier.
					</Trans>
				</Intro>

				<Message type="info" icon>
					<Body>
						<Trans i18nKey="choix-statut.home.info">
							Pour obtenir un résultat optimal, vous devez répondre à toutes les
							questions.
						</Trans>
					</Body>
				</Message>

				<Spacing md />

				<Grid container spacing={3} style={{ alignItems: 'center' }}>
					<Grid item xs={12} sm={'auto'}>
						<Button
							size="XL"
							to={relativeSitePaths.assistants['choix-du-statut'][stepOrder[0]]}
						>
							<Trans i18nKey="choix-statut.home.find-statut">
								Trouver le bon statut
							</Trans>
						</Button>
					</Grid>

					<Grid item>
						<SmallBody
							grey
							css={`
								display: flex;
								gap: 0.5rem;
							`}
						>
							<ClockIcon />
							<Trans i18nKey="choix-statut.home.estimated-duration">
								Durée estimée : 5 minutes.
							</Trans>
						</SmallBody>
					</Grid>
				</Grid>
			</PageHeader>

			<Spacing xl />

			<StyledContainer>
				{/* <Grid item xs={12}> */}
				<H3>
					<Trans i18nKey="common.useful-resources">Ressources utiles</Trans>
				</H3>
				{/* </Grid> */}

				<Grid container spacing={3} role="list">
					<SimulateurCard
						role="listitem"
						{...simulateurData['coût-création-entreprise']}
					/>
					<SimulateurCard
						role="listitem"
						{...simulateurData['comparaison-statuts']}
					/>
				</Grid>
			</StyledContainer>
		</FromBottom>
	)
}

const Bold = styled.span`
	font-weight: bold;
`

const StyledContainer = styled(Container)`
	background-color: ${({ theme }) =>
		theme.darkMode
			? theme.colors.bases.primary[800]
			: theme.colors.bases.primary[200]};
	padding-bottom: 2rem;

	${H3} {
		font-size: 26px;
		line-height: 32px;
		margin-bottom: 1.5rem;
	}
`
