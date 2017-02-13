import React, {Component} from 'react'
import {FormDecorator} from './FormDecorator'
import {answer, answered} from './userAnswerButtonStyle'
import HoverDecorator from '../HoverDecorator'
import Explicable from './Explicable'
import R from 'ramda'

@HoverDecorator
class RadioLabel extends Component {

	render() {
		let {value, label, input, submit, hover, themeColours} = this.props,
			// value = R.when(R.is(Object), R.prop('value'))(choice),
			labelStyle =
				Object.assign(
					(value === input.value || hover) ? answered(themeColours) : answer(themeColours),
					value === '_' ? {fontWeight: 'bold'} : null
				)

		return (
			<label key={value}
				style={labelStyle}
				className="radio" >
				<input
					type="radio" {...input} onClick={submit}
					value={value} checked={value === input.value ? 'checked' : ''} />
				<Explicable name={value} label={label}/>
			</label>
		)
	}
}

/* Ceci est une saisie de type "radio" : l'utilisateur choisit une réponse dans une liste.
FormDecorator permet de factoriser du code partagé par les différents types de saisie,
dont Question est un example */
@FormDecorator('question')
export default class Question extends Component {
	render() {
		let {
			input,
			stepProps: {submit, choices},
			themeColours
		} = this.props

		return (
			<div>
				{ choices.map((choice) => do {
					let {value, label} = R.is(String)(choice) ? {value: choice, label: null} : choice;
					<RadioLabel key={value} {...{value, label, input, submit, themeColours}}/>
				}
				)}
			</div>
		)
	}
}
