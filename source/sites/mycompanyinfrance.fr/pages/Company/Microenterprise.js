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
		The Micro entreprise is a simplified scheme of declaration and payment, whose tax and social contributions are based on the turnover achieved each month. Available for
 companies whose annual turnover does not exceed (for the past year) 70 000 € for services providers or 170 000 € for micro-entrepreneurs whose main activity is the sale of goods, catering or the provision of housing.
                </p><p>This is a interesting choice if you do not need lot of capital for your activity, you plan it to be small, and you want the minimum amount of paperwork to get started. </p>
		<p>For all other case, it is advised to choose the standard status, which is Individual Business.</p>

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
