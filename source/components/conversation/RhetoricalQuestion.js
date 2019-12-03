import FormDecorator from 'Components/conversation/FormDecorator'
import React from 'react'
import { useTranslation } from 'react-i18next'

export default FormDecorator('rhetorical-question')(
	function RhetoricalQuestion({ value: currentValue, submit, possibleChoice }) {
		const { t } = useTranslation()
		if (!possibleChoice) return null // No action possible, don't render an answer
		let { text, value } = possibleChoice
		return (
			<span className="answer">
				<label key={value} className="radio userAnswerButton">
					<input
						type="radio"
						checked={value === currentValue}
						onClick={submit}
						value={value}
					/>
					{t(text)}
				</label>
			</span>
		)
	}
)
