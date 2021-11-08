import PageHeader from 'Components/PageHeader'
import { FromBottom } from 'Components/ui/animate'
import Meta from 'Components/utils/Meta'
import { SitePathsContext } from 'Components/utils/SitePathsContext'
import { useContext } from 'react'
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
			<Meta
				page="créer"
				title="Créer"
				description="Créer une entreprise"
				ogImage={créerSvg}
			/>
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

			<h2 className="ui__ h h3">
				<Trans>Ressources utiles</Trans>
			</h2>
			<div className="ui__ box-container">
				<Link
					className="ui__ interactive card box lighter-bg"
					to={sitePaths.créer.guideStatut.liste}
				>
					<Trans i18nKey="créer.ressources.listeStatuts">
						<h3 className="ui__ h h5">Liste des statuts juridiques</h3>
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
						<h3 className="ui__ h h5">Comparateur de régimes</h3>
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
						<h3 className="ui__ h h5">Démarche auto-entrepreneur</h3>
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
