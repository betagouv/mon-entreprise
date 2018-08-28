/* @flow */
import { chooseCompanyLiability } from 'Actions/companyStatusActions'
import React from 'react'
import { connect } from 'react-redux'
import { SkipButton } from 'Ui/Button'
import type { CompanyLiability } from 'Types/companyStatusTypes'

type Props = {
	chooseCompanyLiability: (?CompanyLiability) => void
}

const Liability = ({ chooseCompanyLiability }: Props) => (
	<>
		<h2>Choosing the liability </h2>
		<p>
			The legal setup is the framework that allows the company to be created. An
			entrepreneur can choose between two major legal options:
		</p>
		<ul>
			<li>
				<strong>Sole proprietorship: </strong>
				This is an economic activity conducted by a single natural person, in
				his own name. It&apos;s less paperwork, but bigger trouble in case of
				bankruptcy, as your personal wealth can be put to contribution.
			</li>
			<li>
				<strong>Limited liability: </strong>A limited liability company is a
				corporate structure whereby the company members cannot be held
				personally liable for the company&apos;s debts or liabilities. However,
				it's heavier to set up, and you need to provide a initial capital.
			</li>
		</ul>
		<div className="ui__ answer-group">
			<button
				onClick={() => {
					chooseCompanyLiability('SOLE_PROPRIETORSHIP')
				}}
				className="ui__ button">
				Sole proprietorship
			</button>
			<button
				onClick={() => {
					chooseCompanyLiability('LIMITED_LIABILITY')
				}}
				className="ui__ button">
				Limited liability
			</button>
			<SkipButton onClick={() => chooseCompanyLiability(null)} />
		</div>
		{/* this is an economic activity conducted by a single natural person, in his own name ; */}
		{/* Company  : This is an economic activity conducted by a single partner - single member company with limited liability (EURL) - or several partners (limited liability company (SARL), public limited company (SA), simplified joint-stock company (SAS)...). */}
	</>
)

export default connect(
	null,
	{ chooseCompanyLiability }
)(Liability)
