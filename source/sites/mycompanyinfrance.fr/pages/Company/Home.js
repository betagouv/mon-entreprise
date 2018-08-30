/* @flow */
import Scroll from 'Components/utils/Scroll'
import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { nextQuestionUrlSelector } from 'Selectors/companyStatusSelectors'
import { isIE } from '../../../../utils'
import LegalStatusChoices from './LegalStatusChoice'

import type { Match, RouterHistory } from 'react-router'
type Props = {
	match: Match,
	history: RouterHistory,
	nextQuestionUrl: string
}
const CreateMyCompany = ({ match, nextQuestionUrl, history }: Props) => (
	<>
		<h1 className="question__title">Create your company</h1>
		<p>
			<Link className="ui__ link-button" to="/company/find">
				My company is already registered with the French Administration
			</Link>
		</p>
		<p>
			The French business law defines more than 20 possible legal statuses to
			declare a company with various acronyms and processes : SAS, SARL, SA,
			EIRL... This guide will help you find quickly the right status for your
			needs.
		</p>
		{match.isExact && (
			<div className="ui__ answer-group">
				<Link className="ui__ button" to={nextQuestionUrl}>
					Choose your legal status
				</Link>
				<Link to={'/social-security'} className="ui__ skip-button">
					Do it later ›
				</Link>
			</div>
		)}
		{!isIE() &&
			!match.isExact && <Scroll.toElement key={history.location.pathname} />}
		<LegalStatusChoices />
	</>
)

export default connect(
	state => ({ nextQuestionUrl: nextQuestionUrlSelector(state) }),
	null
)(CreateMyCompany)
