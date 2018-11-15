/* @flow */
import { React, T } from 'Components'
import { compose } from 'ramda'
import Helmet from 'react-helmet'
import { withI18n } from 'react-i18next'
import { connect } from 'react-redux'
import { Link, Redirect } from 'react-router-dom'
import { nextQuestionUrlSelector } from 'Selectors/companyStatusSelectors'
import sitePaths from '../../sitePaths'
import LegalStatusChoices from './LegalStatusChoice'
import type { TFunction } from 'react-i18next'

import type { Match } from 'react-router'

type Props = {
	match: Match,
	nextQuestionUrl: string,
	guideAlreadyStarted: boolean,
	t: TFunction
}
const CreateMyCompany = ({
	match,
	nextQuestionUrl,
	guideAlreadyStarted,
	t
}: Props) => (
	<>
		{match.isExact && guideAlreadyStarted && <Redirect to={nextQuestionUrl} />}
		<Helmet>
			<title>
				{t(
					'entreprise.statusJuridique.page.titre',
					'Quel statut juridique choisir pour votre entreprise ?'
				)}
			</title>
			<meta
				name="description"
				content="The French business law defines more than 20 possible legal statuses to
				declare a company with various acronyms and processes : SAS, SARL, SA,
				EIRL... This guide quickly helps you to find the right status for your company project"
			/>
		</Helmet>

		<h1 className="question__title">
			<T>Choisir le statut juridique</T>
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
		<LegalStatusChoices />
	</>
)

export default compose(
	connect(
		state => ({
			nextQuestionUrl: nextQuestionUrlSelector(state),
			guideAlreadyStarted: !!Object.keys(state.inFranceApp.companyLegalStatus)
				.length
		}),
		null
	),
	withI18n()
)(CreateMyCompany)
