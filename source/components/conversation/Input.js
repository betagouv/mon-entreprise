import { ThemeColorsContext } from 'Components/utils/colors'
import { currencyFormat } from 'Engine/format'
import { compose } from 'ramda'
import React, { useCallback, useContext } from 'react'
import { useTranslation } from 'react-i18next'
import NumberFormat from 'react-number-format'
import { debounce } from '../../utils'
import { FormDecorator } from './FormDecorator'
import InputSuggestions from './InputSuggestions'
import InputEstimation from './InputEstimation'
import SendButton from './SendButton'

// TODO: fusionner Input.js et CurrencyInput.js
export default compose(FormDecorator('input'))(function Input({
	suggestions,
	setFormValue,
	submit,
	dottedName,
	value,
	unit,
	inputEstimation,
}) {
	const colors = useContext(ThemeColorsContext)
	const debouncedSetFormValue = useCallback(debounce(750, setFormValue), [])
	const { language } = useTranslation().i18n

	const { thousandSeparator, decimalSeparator } = currencyFormat(language)

	return (
		<>
			<div css="width: 100%">
				<InputSuggestions
					suggestions={suggestions}
					onFirstClick={(value) => {
						setFormValue(value)
					}}
					onSecondClick={() => submit('suggestion')}
				/>
			</div>

			<div className="answer">
				<NumberFormat
					autoFocus
					className={'suffixed'}
					id={'step-' + dottedName}
					thousandSeparator={thousandSeparator}
					decimalSeparator={decimalSeparator}
					allowEmptyFormatting={true}
					style={{ border: `1px solid ${colors.textColorOnWhite}` }}
					onValueChange={({ floatValue }) => {
						debouncedSetFormValue(floatValue)
					}}
					value={value}
					autoComplete="off"
				/>
				<label className="suffix" htmlFor={'step-' + dottedName}>
					{unit}
				</label>
				<SendButton {...{ disabled: value === undefined, submit }} />
			</div>
			<div css="width: 100%">
				{inputEstimation && (
					<InputEstimation
						inputEstimation={inputEstimation}
						setFinalValue={(value) => {
							setFormValue(value)
						}}
					/>
				)}
			</div>
		</>
	)
})
