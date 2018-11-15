import FormDecorator from 'Components/conversation/FormDecorator'
import React, { Component } from 'react'
import { answer } from './userAnswerButtonStyle'

export default FormDecorator('rhetorical-question')(
	class RhetoricalQuestion extends Component {
		render() {
			let { input, submit, possibleChoice, themeColours } = this.props

			if (!possibleChoice) return null // No action possible, don't render an answer

			let { text, value } = possibleChoice

			return (
				<span className="answer">
					<label key={value} className="radio" style={answer(themeColours)}>
						<input type="radio" {...input} onClick={submit} value={value} />
						{text}
					</label>
				</span>
			)
		}
	}
)
