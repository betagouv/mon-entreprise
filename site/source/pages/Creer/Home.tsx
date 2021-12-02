import { Grid } from '@mui/material'
import PageHeader from 'Components/PageHeader'
import { FromBottom } from 'Components/ui/animate'
import Meta from 'Components/utils/Meta'
import { SitePathsContext } from 'Components/utils/SitePathsContext'
import { Button } from 'DesignSystem/buttons'
import { Card } from 'DesignSystem/card'
import { H2 } from 'DesignSystem/typography/heading'
import { Intro, SmallBody } from 'DesignSystem/typography/paragraphs'
import { useContext } from 'react'
import { Helmet } from 'react-helmet-async'
import { Trans, useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { RootState } from 'Reducers/rootReducer'
import { useNextQuestionUrl } from 'Selectors/companyStatusSelectors'
import { TrackPage } from '../../ATInternetTracking'
import créerSvg from './créer.svg'

export default function Créer() {
	const { t } = useTranslation()
	const sitePaths = useContext(SitePathsContext)
	const nextQuestionUrl = useNextQuestionUrl()
	const guideAlreadyStarted = useSelector(
		(state: RootState) =>
			!!Object.keys(state.inFranceApp.companyLegalStatus).length
	)
	return (
		<FromBottom>
			<TrackPage name="accueil" />
			<Meta
				page="créer"
				title="Créer"
				description="Créer une entreprise"
				ogImage={créerSvg}
			/>

			<Helmet>
				<title>{t('créer.titre', 'Créer une entreprise')}</title>
			</Helmet>
			<PageHeader
				titre={<Trans i18nKey="créer.titre">Créer une entreprise</Trans>}
				picture={créerSvg}
			>
				<Intro>
					<Trans i18nKey="créer.description">
						Avant d'entamer les démarches administratives pour créer votre
						entreprise, vous devez choisir un statut juridique adapté à votre
						activité
					</Trans>
				</Intro>
				<Button
					size="XL"
					to={
						guideAlreadyStarted && nextQuestionUrl
							? nextQuestionUrl
							: sitePaths.créer.guideStatut.multipleAssociates
					}
				>
					{!guideAlreadyStarted
						? t('créer.cta.default', 'Trouver le bon statut')
						: t('créer.cta.continue', 'Continuer le guide')}
				</Button>
				<SmallBody>
					<Trans i18nKey="créer.warningPL">
						Le cas des professions libérales réglementées n'est pas encore
						traité
					</Trans>
				</SmallBody>
			</PageHeader>

			<H2 className="sr-only">
				<Trans>Ressources utiles</Trans>
			</H2>

			<Grid container spacing={3}>
				<Grid item xs={12} sm={6} lg={4}>
					<Card
						title={t(
							'créer.ressources.listeStatuts.title',
							'Liste des statuts juridiques'
						)}
						to={sitePaths.créer.guideStatut.liste}
						ctaLabel={t('créer.ressources.listeStatuts.cta', 'Voir la liste')}
					>
						<Trans i18nKey="créer.ressources.listeStatuts.body">
							Vous savez déjà quel statut choisir ? Accédez directement à la
							liste des démarches associées
						</Trans>
					</Card>
				</Grid>
				<Grid item xs={12} sm={6} lg={4}>
					<Card
						title={t(
							'créer.ressources.comparaison.title',
							'Comparateur de régimes'
						)}
						to={{
							pathname: sitePaths.simulateurs.comparaison,
							state: { fromCréer: true },
						}}
						ctaLabel={t('créer.ressources.comparaison.cta', 'Comparer')}
					>
						<Trans i18nKey="créer.ressources.comparaison.body">
							Indépendant, assimilé-salarié ou auto-entrepreneur ? Calculez les
							différences en terme de revenus, cotisations, retraite, etc
						</Trans>
					</Card>
				</Grid>
				<Grid item xs={12} sm={6} lg={4}>
					<Card
						title={t(
							'créer.ressources.autoEntrepreneur.title',
							'Démarche auto-entrepreneur'
						)}
						to={sitePaths.créer['auto-entrepreneur']}
						ctaLabel={t(
							'créer.ressources.autoEntrepreneur.cta',
							'Consulter les démarches'
						)}
					>
						<Trans i18nKey="créer.ressources.autoEntrepreneur.body">
							Vous souhaitez devenir auto-entrepreneur ? Découvrez les étapes
							pour bien démarrer votre activité
						</Trans>
					</Card>
				</Grid>
			</Grid>
		</FromBottom>
	)
}
