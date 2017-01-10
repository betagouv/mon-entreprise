import React, {Component} from 'react'
import {FormDecorator} from './FormDecorator'
import {answer} from './userAnswerButtonStyle'

@FormDecorator('rhetorical-question')
export default class RhetoricalQuestion extends Component {
	render() {
		let {
			input,
			stepProps: {submit, possibleChoice},
			themeColours
		} = this.props

		if (!possibleChoice) return null // No action possible, don't render an answer

		let {text, value} = possibleChoice

		return (
			<span className="answer">
				<label key={value} className="radio" style={answer(themeColours)}>
					<input
						type="radio" {...input} onClick={submit}
						value={value} />
					{text}
				</label>
			</span>
		)
	}

}
