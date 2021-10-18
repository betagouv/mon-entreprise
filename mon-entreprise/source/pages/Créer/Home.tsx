import PageHeader from 'Components/PageHeader'
import { FromBottom } from 'Components/ui/animate'
import { SitePathsContext } from 'Components/utils/SitePathsContext'
import { H3, H5 } from 'DesignSystem/typography/heading'
import { useContext } from 'react'
import { Helmet } from 'react-helmet'
import { Trans, useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
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

			<Helmet>
				<title>{t('créer.titre', 'Créer une entreprise')}</title>
			</Helmet>
			<PageHeader
				titre={<Trans i18nKey="créer.titre">Créer une entreprise</Trans>}
				picture={créerSvg}
			>
				<p className="ui__ lead">
					<Trans i18nKey="créer.description">
						Avant d'entamer les démarches administratives pour créer votre
						entreprise, vous devez choisir un statut juridique adapté à votre
						activité
					</Trans>
				</p>
				<Link
					className="ui__ button plain cta"
					to={
						guideAlreadyStarted && nextQuestionUrl
							? nextQuestionUrl
							: sitePaths.créer.guideStatut.multipleAssociates
					}
				>
					{!guideAlreadyStarted
						? t('créer.cta.default', 'Trouver le bon statut')
						: t('créer.cta.continue', 'Continuer le guide')}
				</Link>
				<p className="ui__ notice">
					<Trans i18nKey="créer.warningPL">
						Le cas des professions libérales réglementées n'est pas encore
						traité
					</Trans>
				</p>
			</PageHeader>

			<H3 as="h2">
				<Trans>Ressources utiles</Trans>
			</H3>
			<div className="ui__ box-container">
				<Link
					className="ui__ interactive card box lighter-bg"
					to={sitePaths.créer.guideStatut.liste}
				>
					<Trans i18nKey="créer.ressources.listeStatuts">
						<H5 as="h3">Liste des statuts juridiques</H5>
						<small>
							Vous savez déjà quel statut choisir ? Accédez directement à la
							liste des démarches associées
						</small>
					</Trans>
				</Link>
				<Link
					className="ui__ interactive card box lighter-bg"
					to={{
						pathname: sitePaths.simulateurs.comparaison,
						state: { fromCréer: true },
					}}
				>
					<Trans i18nKey="créer.ressources.comparaison">
						<H5 as="h3">Comparateur de régimes</H5>
						<small>
							Indépendant, assimilé-salarié ou auto-entrepreneur ? Calculez les
							différences en terme de revenus, cotisations, retraite, etc
						</small>
					</Trans>
				</Link>

				<Link
					className="ui__ interactive card box lighter-bg"
					to={sitePaths.créer['auto-entrepreneur']}
				>
					<Trans i18nKey="créer.ressources.autoEntrepreneur">
						<H5 as="h3">Démarche auto-entrepreneur</H5>
						<small>
							Vous souhaitez devenir auto-entrepreneur ? Découvrez les étapes
							pour bien démarrer votre activité
						</small>
					</Trans>
				</Link>
			</div>
		</FromBottom>
	)
}
