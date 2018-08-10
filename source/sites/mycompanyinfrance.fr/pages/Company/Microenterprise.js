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
		The Micro entreprise is a simplified scheme of declaration and payment, whose tax and social contributions are based on the turnover achieved each month. Available for companies whose annual turnover does not exceed (for the past year) 70 000 € for services providers or 170 000 € for micro-entrepreneurs whose main activity is the sale of goods, catering or the provision of housing.</p>
<p>This is a interesting choice if:</p>
<ul>
	<li>you do not need lot of capital and important expenses to run your activity</li>
	<li>you want to test the viability or plan it to be small</li>
	<li>you want the minimum amount of paperwork to get started</li>
</ul>
<p><strong>Note:</strong></p>
<ul>
<li>Some activities are excluded from this status. <a href="https://www.afecreation.fr/pid10375/pour-quelles-activites.html#principales-exclusions">See the list (French)</a></li>
<li>Some activities are regulated with a qualification or a professional experience. <a href="https://www.afecreation.fr/pid316/activites-reglementees.html">See the list (French)</a></li>

</ul>
<p>For all other case, it is advised to choose the standard status, which is <strong>Individual Business.</strong></p>
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
