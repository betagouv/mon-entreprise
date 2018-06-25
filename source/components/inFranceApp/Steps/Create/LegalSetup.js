/* @flow */
import React from 'react'
import { connect } from 'react-redux'
import { setCompanyLegalSetup } from '../../actions'
import * as Animate from '../../animate'
import { SkipButton } from '../../ui/Button'
const LegalSetup = ({ setCompanyLegalSetup }) => (
	<Animate.fromBottom>
		<h2>1. Choosing the legal setup </h2>
		<p>
			The legal setup is the framework that allows the company to be created. An
			entrepreneur can choose between two major legal options:
		</p>
		<ul>
			<li>
				<strong>Sole proprietorship: </strong>
				This is an economic activity conducted by a single natural person, in
				his own name. It&apos;s less paperwork, but bigger trouble in case of
				bankeroute.
			</li>
			<li>
				<strong>Limited liability: </strong>
				A limited liability company is a corporate structure whereby the company
				members cannot be held personally liable for the company&apos;s debts or
				liabilities.
			</li>
		</ul>
		<div className="ui__ answer-group">
			<button
				onClick={() =>
					setCompanyLegalSetup({ legalSetup: 'SOLE_PROPRIETORSHIP' })
				}
				className="ui__ button">
				Sole proprietorship
			</button>
			<button className="ui__ button">Limited liability</button>
			<SkipButton />
		</div>
		{/* this is an economic activity conducted by a single natural person, in his own name ; */}
		{/* Company  : This is an economic activity conducted by a single partner - single member company with limited liability (EURL) - or several partners (limited liability company (SARL), public limited company (SA), simplified joint-stock company (SAS)...). */}
	</Animate.fromBottom>
)

export default connect(
	null,
	{
		setCompanyLegalSetup
	}
)(LegalSetup)
