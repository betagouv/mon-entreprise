import React from 'react'
import { Trans, translate } from 'react-i18next'
import { Field } from 'redux-form'
import './PeriodSwitch.css'
import { reduxForm } from 'redux-form'
import { compose } from 'ramda'

export default compose(
	reduxForm({
		form: 'conversation',
		destroyOnUnmount: false,
		initialValues: { période: 'mois' }
	}),
	translate()
)(function PeriodSwitch() {
	return (
		<div id="PeriodSwitch">
			<>
				<label>
					<Field name="période" component="input" type="radio" value="mois" />
					<span />
					<span className="radioText">
						<Trans>Mois</Trans>
					</span>
				</label>

				<label>
					<Field name="période" component="input" type="radio" value="année" />
					<span />

					<span className="radioText">
						<Trans>Année</Trans>
					</span>
				</label>
			</>
		</div>
	)
})
