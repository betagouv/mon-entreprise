import { SitePathsContext } from 'Components/utils/SitePathsContext'
import React, { useContext } from 'react'
import { Helmet } from 'react-helmet'
import { Trans, useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { RootState } from 'Reducers/rootReducer'
import { nextQuestionUrlSelector } from 'Selectors/companyStatusSelectors'
import Animate from 'Components/ui/animate'
import créerSvg from './créer.svg'

export default function Créer() {
	const { t } = useTranslation()
	const sitePaths = useContext(SitePathsContext)
	const nextQuestionUrl = useSelector((state: RootState) =>
		nextQuestionUrlSelector(state, { sitePaths })
	)
	const guideAlreadyStarted = useSelector(
		(state: RootState) =>
			!!Object.keys(state.inFranceApp.companyLegalStatus).length
	)
	return (
		<Animate.fromBottom>
			<Helmet>
				<title>{t('créer.titre', 'Créer une entreprise')}</title>
			</Helmet>

			<h1>
				<Trans i18nKey="créer.titre">Créer une entreprise</Trans>
			</h1>
			<div css="display: flex; align-items: flex-start; justify-content: space-between">
				<div>
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
				</div>

				<img
					className="ui__ hide-mobile"
					src={créerSvg}
					css="margin-left: 3rem; max-width: 15rem; transform: translateX(2rem) scale(1.4);"
				/>
			</div>
			<h2>
				<Trans>Ressources utiles</Trans>
			</h2>
			<div className="ui__ box-container">
				<Link
					className="ui__ interactive card box lighter-bg"
					to={sitePaths.créer.guideStatut.liste}
				>
					<Trans i18nKey="créer.ressources.listeStatuts">
						<p>Liste des statuts juridiques</p>
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
						state: { fromCréer: true }
					}}
				>
					<Trans i18nKey="créer.ressources.comparaison">
						<p>Comparateur de régimes</p>
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
						<p>Démarche auto-entrepreneur</p>
						<small>
							Vous souhaitez devenir auto-entrepreneur ? Découvrez les étapes
							pour bien démarrer votre activité
						</small>
					</Trans>
				</Link>
			</div>
		</Animate.fromBottom>
	)
}
