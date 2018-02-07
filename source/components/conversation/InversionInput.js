import React, { Component } from 'react'
import { FormDecorator } from './FormDecorator'
import { answer, answered } from './userAnswerButtonStyle'
import HoverDecorator from '../HoverDecorator'
import Explicable from './Explicable'
import { Field } from 'redux-form'

@FormDecorator('inversionInput')
export default class InversionInput extends Component {
	componentDidMount() {
		let { dottedName, inversion, setFormValue } = this.props
		// initialize the form field of renderinversions
		setFormValue(inversion.inversions[0].dottedName, 'inversions.' + dottedName)
	}
	render() {
		let { dottedName, inversion, setFormValue } = this.props

		if (inversion.inversions.length === 1)
			return (
				<span>
					{inversion.inversions[0].title || inversion.inversions[0].dottedName}
				</span>
			)
		// This field is handled by redux-form : it will set in the state what's
		// the current inversion
		return (
			<div id="inversions">
				{inversion.inversions.map(({ name, title, dottedName: value }) => (
					<label key={value}>
						<Field
							name={'inversions.' + dottedName}
							component="input"
							type="radio"
							value={value}
						/>
						{title || name}
					</label>
				))}
			</div>
		)
	}
}
