import { ThemeColorsContext } from 'Components/utils/colors'
import { currencyFormat } from 'Engine/format'
import { serializeUnit } from 'Engine/units'
import React, { useCallback, useContext } from 'react'
import { useTranslation } from 'react-i18next'
import NumberFormat from 'react-number-format'
import { debounce } from '../../utils'
import InputSuggestions from './InputSuggestions'
import SendButton from './SendButton'

// TODO: fusionner Input.js et CurrencyInput.js
export default function Input({
	suggestions,
	onChange,
	onSubmit,
	dottedName,
	value,
	defaultValue,
	autoFocus,
	unit
}) {
	const colors = useContext(ThemeColorsContext)
	const debouncedOnChange = useCallback(debounce(750, onChange), [])
	const { language } = useTranslation().i18n
	const { thousandSeparator, decimalSeparator } = currencyFormat(language)

	return (
		<div className="step input">
			<div>
				<InputSuggestions
					suggestions={suggestions}
					onFirstClick={value => {
						onChange(value)
					}}
					onSecondClick={() => onSubmit && onSubmit('suggestion')}
					unit={unit}
				/>
				<NumberFormat
					autoFocus={autoFocus}
					className="suffixed"
					id={'step-' + dottedName}
					placeholder={defaultValue?.nodeValue ?? defaultValue}
					thousandSeparator={thousandSeparator}
					decimalSeparator={decimalSeparator}
					allowEmptyFormatting={true}
					style={{ border: `1px solid ${colors.textColorOnWhite}` }}
					onValueChange={({ floatValue }) => {
						debouncedOnChange(floatValue)
					}}
					value={value}
					autoComplete="off"
				/>
				<label className="suffix" htmlFor={'step-' + dottedName}>
					{serializeUnit(unit, value, language)}
				</label>
			</div>
			{onSubmit && (
				<SendButton disabled={value === undefined} onSubmit={onSubmit} />
			)}
		</div>
	)
}
