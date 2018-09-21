/* @flow */
import { chooseCompanyLiability } from 'Actions/companyStatusActions'
import React from 'react'
import Helmet from 'react-helmet'
import { connect } from 'react-redux'
import { SkipButton } from 'Ui/Button'
import type { CompanyLiability } from 'Types/companyStatusTypes'
type Props = {
	multipleAssociates: ?boolean,
	chooseCompanyLiability: (?CompanyLiability) => void
}

const Liability = ({ chooseCompanyLiability, multipleAssociates }: Props) => (
	<>
		<Helmet>
			<title>Choosing the liability for your company in France</title>
			<meta
				name="description"
				content="Sole proprietorship or limited liability? Each option has legal implications, and leads to a different status for creating your company in France"
			/>
		</Helmet>
		<h2>Choosing the liability </h2>
		<p>
			An entrepreneur can choose between several options for the legal setup of
			his company:
		</p>
		<ul>
			<li>
				{multipleAssociates === false ? (
					<>
						<strong>Sole proprietorship: </strong>
						An economic activity conducted by a single natural person, in his
						own name. It&apos;s less paperwork, but bigger trouble in case of
						bankruptcy, as your personal wealth can be put to contribution.
					</>
				) : (
					<>
						<strong>
							Unlimited {multipleAssociates === true && 'joint and several'}{' '}
							liability:{' '}
						</strong>
						The financial liability of the shareholders is not limited to their
						contribution. In case of bankruptcy, their personal wealth can be
						put to contribution
					</>
				)}
			</li>

			<li>
				<strong>Limited liability: </strong>A corporate structure whereby the
				company members cannot be held personally liable for the company&apos;s
				debts or liabilities. However, it's heavier to set up, and you need to
				provide an initial capital.
			</li>
		</ul>
		<div className="ui__ answer-group">
			<button
				onClick={() => {
					chooseCompanyLiability('UNLIMITED_LIABILITY')
				}}
				className="ui__ button">
				{multipleAssociates === false
					? 'Sole proprietorship'
					: 'Unlimited Liability'}
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
	state => ({
		multipleAssociates: state.inFranceApp.companyLegalStatus.multipleAssociates
	}),
	{ chooseCompanyLiability }
)(Liability)
