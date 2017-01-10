import React, {Component} from 'react'
import {FormDecorator} from './FormDecorator'
import {answer, answered} from './userAnswerButtonStyle'
import HoverDecorator from '../HoverDecorator'

@HoverDecorator
class RadioLabel extends Component {

	render() {
		let {choice, input, submit, hover, themeColours} = this.props,
			labelStyle =
				Object.assign(
					(choice === input.value || hover) ? answered(themeColours) : answer(themeColours),
				)

		return (
			<label
				style={labelStyle}
				className="radio" >
				<input
					type="radio" {...input} onClick={submit}
					value={choice} checked={choice === input.value ? 'checked' : ''} />
				{choice}
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
			<span>
				{ choices.map((choice) =>
						<RadioLabel key={choice} {...{choice, input, submit, themeColours}}/>
				)}
			</span>
		)
	}
}
