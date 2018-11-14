import withColours from 'Components/utils/withColours'
import React, { Component } from 'react'
import { translate } from 'react-i18next'
import { Field } from 'redux-form'

export default function PeriodSwitch() {
	return (
		<>
			<label>Entrez un salaire</label>
			<>
				<label>
					<Field name="période" component="input" type="radio" value="mois" />
					mensuel
				</label>
				<label>
					<Field name="période" component="input" type="radio" value="année" />
					annuel
				</label>
			</>
		</>
	)
}
