/* @flow */
import { companyIsMicroenterprise } from 'Actions/companyStatusActions'
import React from 'react'
import { connect } from 'react-redux'
import { SkipButton } from 'Ui/Button'

type Props = {
	companyIsMicroenterprise: (?boolean) => void
}

const Microenterprise = ({ companyIsMicroenterprise }: Props) => (
	<>
		<h2>Microenterprise or Individual Business</h2>
		<p>
			The micro entreprise is a simplified scheme of declaration and payment,
			for which tax and social contributions are based on the turnover achieved
			each month. Available for companies whose annual turnover does not exceed
			70 000 € for services providers or 170 000 € when the main activity is the
			sale of goods, catering or the provision of housing.
		</p>
		<p>This is an interesting choice if:</p>
		<ul>
			<li>
				You do not need a lot of capital and important expenses to run your
				activity
			</li>
			<li>You want to test the viability or plan it to be small</li>
			<li>You want the minimum amount of paperwork to get started</li>
		</ul>
		<p>
			<strong>Note:</strong> Some activities are excluded from this status (
			<a href="https://www.afecreation.fr/pid10375/pour-quelles-activites.html#principales-exclusions">
				see the list
			</a>
			). Some activities are regulated with a qualification or a professional
			experience (
			<a href="https://www.afecreation.fr/pid316/activites-reglementees.html">
				see the list
			</a>
			).
		</p>
		<p>
			For all the other cases, it is advised to choose the standard status,
			which is <strong>Individual Business.</strong>
		</p>
		<div className="ui__ answer-group">
			<button
				onClick={() => {
					companyIsMicroenterprise(true)
				}}
				className="ui__ button">
				Microenterprise
			</button>
			<button
				onClick={() => {
					companyIsMicroenterprise(false)
				}}
				className="ui__ button">
				Individual Business
			</button>
			<SkipButton onClick={() => companyIsMicroenterprise(null)} />
		</div>
	</>
)

export default connect(
	null,
	{ companyIsMicroenterprise }
)(Microenterprise)
