import React, { Component } from 'react'
import { FormDecorator } from './FormDecorator'
import { answer, answered } from './userAnswerButtonStyle'
import HoverDecorator from '../HoverDecorator'
import Explicable from './Explicable'
import { Field, formValueSelector } from 'redux-form'
import './InversionInput.css'
import { Input } from './Input'
import { connect } from 'react-redux'
import { path, last } from 'ramda'
import { change } from 'redux-form'
import classNames from 'classnames'
let getActiveInversion = ({ inputInversions, dottedName }) =>
	inputInversions && path(dottedName.split('.'), inputInversions)

@connect(
	state => ({
		inputInversions: formValueSelector('conversation')(state, 'inversions')
	}),
	dispatch => ({
		clearPreviousInversionValue: field =>
			dispatch(change('conversation', field, ''))
	})
)
export default class InversionInput extends Component {
	componentWillReceiveProps(newProps) {
		let newInversion = getActiveInversion(newProps),
			inversion = getActiveInversion(this.props)

		if (newInversion !== inversion)
			this.props.clearPreviousInversionValue(inversion)
	}
	render() {
		let activeInversion = getActiveInversion(this.props),
			fieldName = activeInversion || this.props.dottedName,
			fieldTitle = last(fieldName.split(' . '))
		return (
			<Fields {...{ ...this.props, activeInversion, fieldName, fieldTitle }} />
		)
	}
}

@FormDecorator('inversionInput')
class Fields extends Component {
	render() {
		let { dottedName, inversion, fieldName, activeInversion } = this.props
		if (inversion.inversions.length === 1)
			return (
				<span>
					{inversion.inversions[0].title || inversion.inversions[0].dottedName}
				</span>
			)

		// This field is handled by redux-form : it will set in the state what's
		// the current inversion
		return (
			<>
				<div id="inversionRadios">
					{inversion.inversions.map(({ name, title, dottedName: value }) => (
						<label
							key={value}
							className={classNames({
								selected: value === activeInversion,
								unselected: activeInversion && value !== activeInversion
							})}
						>
							<Field
								name={'inversions.' + dottedName}
								component="input"
								type="radio"
								value={value}
							/>
							<Explicable dottedName={value}>{title || name}</Explicable>
						</label>
					))}
				</div>
				{activeInversion && (
					<Input
						{...{
							...this.props,
							suggestions: dottedName === fieldName && this.props.suggestions
						}}
					/>
				)}
			</>
		)
	}
}
