/* @flow */
import { resetCompanyStatusChoice } from 'Actions/companyStatusActions'
import { React, T } from 'Components'
import { compose, toPairs } from 'ramda'
import Helmet from 'react-helmet'
import { withI18n } from 'react-i18next'
import { connect } from 'react-redux'
import { Link, Redirect } from 'react-router-dom'
import { nextQuestionUrlSelector } from 'Selectors/companyStatusSelectors'
import sitePaths from '../../sitePaths'
import PreviousAnswers from './PreviousAnswers'
import type { TFunction } from 'react-i18next'

import type { Match, Location } from 'react-router'

type Props = {
	match: Match,
	nextQuestionUrl: string,
	guideAlreadyStarted: boolean,
	resetCompanyStatusChoice: (?string) => void,
	t: TFunction,
	location: Location
}
const CreateMyCompany = ({
	match,
	nextQuestionUrl,
	guideAlreadyStarted,
	resetCompanyStatusChoice,
	t,
	location
}: Props) => {
	if (!match.isExact) {
		const companyStatusCurrentQuestionName = (toPairs(
			sitePaths().entreprise.statusJuridique
		).find(([, pathname]) => location.pathname === pathname) || [])[0]
		resetCompanyStatusChoice(companyStatusCurrentQuestionName)
	}

	return (
		<>
			{match.isExact && guideAlreadyStarted && (
				<Redirect to={nextQuestionUrl} />
			)}
			<Helmet>
				<title>
					{t(
						'formeJuridique.page.titre',
						'Quel statut juridique choisir pour votre entreprise ?'
					)}
				</title>
				<meta
					name="description"
					content={t(
						'formeJuridique.page.description',
						"Le droit des affaires français définit plus de 20 statuts juridiques possibles pour déclarer une société avec différents acronymes et processus : SAS, SARL, SA, EIRL.... Ce guide vous aide rapidement à trouver le bon statut pour votre projet d'entreprise"
					)}
				/>
			</Helmet>

			<h1 className="question__title">
				<T k="formeJuridique.titre">Choisir le statut juridique</T>
			</h1>
			{match.isExact && (
				<>
					<p>
						<T k="formeJuridique.intro">
							Le droit des sociétés définit plus de 20 statuts juridiques
							possibles pour déclarer une société avec différents acronymes et
							démarches : SAS, SARL, SA, EIRL.... Ce guide vous aide à trouver
							rapidement le statut qui vous convient.
						</T>
					</p>
					<div className="ui__ answer-group">
						<Link className="ui__ button" to={nextQuestionUrl}>
							{!guideAlreadyStarted ? <T>Commencer</T> : <T>Reprendre</T>}
						</Link>
						<Link
							to={sitePaths().sécuritéSociale.index}
							className="ui__ skip-button">
							<T>Plus tard</T> ›
						</Link>
					</div>
				</>
			)}
			<PreviousAnswers />
		</>
	)
}

export default compose(
	connect(
		state => ({
			nextQuestionUrl: nextQuestionUrlSelector(state),
			guideAlreadyStarted: !!Object.keys(state.inFranceApp.companyLegalStatus)
				.length
		}),
		{ resetCompanyStatusChoice }
	),
	withI18n()
)(CreateMyCompany)
