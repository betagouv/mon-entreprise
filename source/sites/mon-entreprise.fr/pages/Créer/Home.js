/* @flow */
import { T } from 'Components'
import Animate from 'Components/ui/animate'
import { SitePathsContext } from 'Components/utils/withSitePaths'
import React, { useContext } from 'react'
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

			<h1 className="question__title">
				<T k="formeJuridique.titre">Créer mon entreprise</T>
			</h1>
			<div css="display: flex; align-items: flex-start; justify-content: space-between">
				<div>

					<p className='ui__ lead'>
						La première étape consiste à choisir un statut juridique qui soit adapté à votre activité.
						Les démarches administratives pour créer votre entreprise changent en fonction de ce dernier.
				</p>
					<Link
						className="ui__ button plain cta"
						to={guideAlreadyStarted ? nextQuestionUrl : sitePaths.créer.guideStatut.multipleAssociates}>
						<T>{!guideAlreadyStarted ? 'Trouver le bon statut' : 'Continuer le guide'}</T>
					</Link>
					<p className="ui__ notice">Note : les forme juridiques spécifiques aux professions libérales réglementées ne sont pas traitées</p>
				</div>

				<img
					className="ui__ hide-mobile"
					src={créerSvg}
					css="margin-left: 3rem; max-width: 15rem; transform: translateX(2rem) scale(1.4);"
				/>
			</div>
			<h2>Ressources utiles</h2>
			<div
				css={`
					display: flex;
					margin-right: -1rem;
					> * {
						flex: 1;
					}
				`}>
				<Link
					className="ui__ interactive card button-choice lighter-bg"
					to={sitePaths.créer.guideStatut.liste}>
					<p>Liste des statuts juridiques </p>
					<small>
						EURL, SARL, SASU, etc : un raccourci si vous connaissez déjà votre statut
					</small>
				</Link>
				<Link
					className="ui__ interactive card button-choice lighter-bg"
					to={{ pathname: sitePaths.simulateurs.comparaison, state: { fromCréer: true } }}>
					<p>SASU, EURL ou auto-entrepreneur ?</p>
					<small>
						Découvrez les différences en terme de revenus, cotisations, retraite, etc.
					</small>
				</Link>

				<Link
					className="ui__ interactive card button-choice lighter-bg"
					to={sitePaths.créer['auto-entrepreneur']}>
					<p>Devenir auto-entrepreneur</p>
					<small>
						Découvrez les démarches de création simplifiées
					</small>
				</Link>
			</div>
		</Animate.fromBottom >
	)
}

