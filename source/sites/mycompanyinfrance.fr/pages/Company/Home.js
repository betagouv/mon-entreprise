/* @flow */
import { React, T } from 'Components'
import Helmet from 'react-helmet'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { nextQuestionUrlSelector } from 'Selectors/companyStatusSelectors'
import sitePaths from '../../sitePaths'
import LegalStatusChoices from './LegalStatusChoice'

import type { Match } from 'react-router'

type Props = {
	match: Match,
	nextQuestionUrl: string
}
const CreateMyCompany = ({ match, nextQuestionUrl }: Props) => (
	<>
		<h1 className="question__title">
			<T>Créer votre entreprise</T>
		</h1>
		<Helmet>
			<title>Trouvez la bonne forme juridique pour votre entreprise.</title>
			<meta
				name="description"
				content="The French business law defines more than 20 possible legal statuses to
				declare a company with various acronyms and processes : SAS, SARL, SA,
				EIRL... This guide quickly helps you to find the right status for your company project"
			/>
		</Helmet>
		<p>
			<Link className="ui__ link-button" to={sitePaths().entreprise.trouver}>
				<T k="entreprise.existeDéjà">Mon entreprise existe déjà</T>
			</Link>
		</p>
		<p>
			<T k="formeJuridique.intro">
				Le droit des sociétés définit plus de 20 statuts juridiques possibles
				pour déclarer une société avec différents acronymes et démarches : SAS,
				SARL, SA, EIRL.... Ce guide vous aide à trouver rapidement le statut qui
				vous convient.
			</T>
		</p>
		{match.isExact && (
			<div className="ui__ answer-group">
				<Link className="ui__ button" to={nextQuestionUrl}>
					<T>Commencer</T>
				</Link>
				<Link
					to={sitePaths().sécuritéSociale.index}
					className="ui__ skip-button">
					<T>Plus tard</T> ›
				</Link>
			</div>
		)}
		<LegalStatusChoices />
	</>
)

export default connect(
	state => ({ nextQuestionUrl: nextQuestionUrlSelector(state) }),
	null
)(CreateMyCompany)
