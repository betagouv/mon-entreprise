/* @flow */
import React from 'react'
import Helmet from 'react-helmet'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { nextQuestionUrlSelector } from 'Selectors/companyStatusSelectors'
import LegalStatusChoices from './LegalStatusChoice'

import type { Match } from 'react-router'

import { Trans, translate } from 'react-i18next'

type Props = {
	match: Match,
	nextQuestionUrl: string
}
const CreateMyCompany = ({ match, nextQuestionUrl }: Props) => (
	<>
		<h1 className="question__title">
			<Trans>Créez votre entreprise</Trans>
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
			<Link className="ui__ link-button" to="/company/find">
				<Trans i18nKey="entreprise.existeDéjà">
					Mon entreprise existe déjà
				</Trans>
			</Link>
		</p>
		<p>
			<Trans i18nKey="entreprise.formeJuridique.intro">
				Le droit des sociétés définit plus de 20 statuts juridiques possibles
				pour déclarer une société avec différents acronymes et démarches : SAS,
				SARL, SA, EIRL.... Ce guide vous aide à trouver rapidement le statut qui
				vous convient.
			</Trans>
		</p>
		{match.isExact && (
			<div className="ui__ answer-group">
				<Link className="ui__ button" to={nextQuestionUrl}>
					<Trans>Choisir la forme juridique</Trans>
				</Link>
				<Link to={'/social-security'} className="ui__ skip-button">
					<Trans>Passer</Trans> ›
				</Link>
			</div>
		)}
		<LegalStatusChoices />
	</>
)

export default connect(
	state => ({ nextQuestionUrl: nextQuestionUrlSelector(state) }),
	null
)(translate()(CreateMyCompany))
