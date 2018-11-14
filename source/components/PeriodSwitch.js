import withColours from 'Components/utils/withColours'
import React, { Component } from 'react'
import { translate } from 'react-i18next'
import { Field } from 'redux-form'
import './PeriodSwitch.css'
import { reduxForm } from 'redux-form'

export default reduxForm({
	form: 'conversation',
	destroyOnUnmount: false,
	initialValues: { période: 'mois' }
})(function PeriodSwitch() {
	return (
		<div id="PeriodSwitch">
			<>
				<label>
					<Field name="période" component="input" type="radio" value="mois" />
					<span />
					<span className="radioText">Mois</span>
				</label>

				<label>
					<Field name="période" component="input" type="radio" value="année" />
					<span />

					<span className="radioText">Année</span>
				</label>
			</>
		</div>
	)
})
