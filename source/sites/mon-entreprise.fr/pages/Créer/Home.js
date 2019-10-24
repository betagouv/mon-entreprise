/* @flow */
import { T } from 'Components'
import Animate from 'Components/ui/animate'
import { SitePathsContext } from 'Components/utils/withSitePaths'
import React, { useContext } from 'react'
import { Helmet } from 'react-helmet'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { nextQuestionUrlSelector } from 'Selectors/companyStatusSelectors'
import créerSvg from './créer.svg'

export default function Créer() {
	const { t } = useTranslation()
	const sitePaths = useContext(SitePathsContext);
	const nextQuestionUrl = useSelector(state => nextQuestionUrlSelector(state, { sitePaths }));
	const guideAlreadyStarted = useSelector(state => !!Object.keys(state.inFranceApp.companyLegalStatus)
		.length);
	return (
		<Animate.fromBottom>
			<Helmet>
				<title>{t(
					'créer.titre',
					'Créer une entreprise'
				)}</title>
			</Helmet>

			<h1>
				<T k="créer.titre">Créer une entreprise</T>
			</h1>
			<div css="display: flex; align-items: flex-start; justify-content: space-between">
				<div>

					<p className='ui__ lead'>
						<T k="créer.description">
							Avant d'entamer les démarches administratives pour créer votre entreprise, vous devez choisir un statut juridique adapté à votre activité
						</T>
					</p>
					<Link
						className="ui__ button plain cta"
						to={guideAlreadyStarted && nextQuestionUrl ? nextQuestionUrl : sitePaths.créer.guideStatut.multipleAssociates}>
						{!guideAlreadyStarted ? t('créer.cta.default', 'Trouver le bon statut') : t('créer.cta.continue', 'Continuer le guide')}
					</Link>
					<p className="ui__ notice"><T k="créer.warningPL">Le cas des professions libérales réglementées n'est pas encore traité</T></p>
				</div>

				<img
					className="ui__ hide-mobile"
					src={créerSvg}
					css="margin-left: 3rem; max-width: 15rem; transform: translateX(2rem) scale(1.4);"
				/>
			</div>
			<h2><T>Ressources utiles</T></h2>
			<div
				css={`
					display: flex;
					margin-right: -1rem;
					flex-wrap: wrap;
					> * {
						flex: 1;
					}
				`}>
				<Link
					className="ui__ interactive card button-choice lighter-bg"
					to={sitePaths.créer.guideStatut.liste}>
					<T k="créer.ressources.listeStatuts">
						<p>Liste des statuts juridiques </p>
						<small>
							Vous savez déjà quel statut choisir ? Accédez directement à la liste des démarches associées
					</small>
					</T>
				</Link>
				<Link
					className="ui__ interactive card button-choice lighter-bg"
					to={{ pathname: sitePaths.simulateurs.comparaison, state: { fromCréer: true } }}>
					<T k="créer.ressources.comparaison">

						<p>Comparateur de régimes</p>
						<small>
							Indépendant, assimilé-salarié ou auto-entrepreneur ? Calculez les différences en terme de revenus, cotisations, retraite, etc
					</small>
					</T>
				</Link>

				<Link
					className="ui__ interactive card button-choice lighter-bg"
					to={sitePaths.créer['auto-entrepreneur']}>
					<T k="créer.ressources.autoEntrepreneur">

						<p>Démarche auto-entrepreneur</p>
						<small>
							Vous souhaitez devenir auto-entrepreneur ? Découvrez les étapes pour bien démarrer votre activité
					</small>
					</T>
				</Link>
			</div>
		</Animate.fromBottom >
	)
}

