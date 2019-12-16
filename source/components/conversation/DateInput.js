import FormattedInput from 'cleave.js/react'
import withColours from 'Components/utils/withColours'
import { compose } from 'ramda'
import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { debounce } from '../../utils'
import { FormDecorator } from './FormDecorator'
import InputSuggestions from './InputSuggestions'
import SendButton from './SendButton'

// TODO: fusionner Input.js et CurrencyInput.js
export default compose(
	FormDecorator('input'),
	withColours
)(function Input({
	suggestions,
	setFormValue,
	submit,
	dottedName,
	value,
	colours,
	unit
}) {
	const debouncedSetFormValue = useCallback(debounce(750, setFormValue), [])
	const { language } = useTranslation().i18n

	return (
		<>
			<div css="width: 100%">
				<InputSuggestions
					suggestions={suggestions}
					onFirstClick={value => {
						setFormValue(value)
					}}
					onSecondClick={() => submit('suggestion')}
				/>
			</div>

			<div className="answer">
				<FormattedInput
					autoFocus
					id={'step-' + dottedName}
					placeholder="JJ/MM/AAAA"
					options={{
						date: true,
						delimiter: '/',
						datePattern: ['d', 'm', 'Y']
					}}
					style={{ border: `1px solid ${colours.textColourOnWhite}` }}
					onChange={({ target: { value } }) => {
						debouncedSetFormValue(value)
					}}
					value={value}
					autoComplete="off"
				/>
				<label className="suffix" htmlFor={'step-' + dottedName}>
					{unit}
				</label>
				<SendButton {...{ disabled: value === undefined, submit }} />
			</div>
		</>
	)
})
