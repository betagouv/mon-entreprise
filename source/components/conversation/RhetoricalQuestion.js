import FormDecorator from 'Components/conversation/FormDecorator'
import React from 'react'

export default FormDecorator('rhetorical-question')(
	function RhetoricalQuestion({ input, submit, possibleChoice }) {
		if (!possibleChoice) return null // No action possible, don't render an answer

		let { text, value } = possibleChoice

		return (
			<span className="answer">
				<label key={value} className="radio userAnswerButton">
					<input type="radio" {...input} onClick={submit} value={value} />
					{text}
				</label>
			</span>
		)
	}
)
