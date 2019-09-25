import classnames from 'classnames'
import { T } from 'Components'
import withColours from 'Components/utils/withColours'
import { compose } from 'ramda'
import NumberFormat from 'react-number-format'
import { currencyFormat } from 'Engine/format'
import { useTranslation } from 'react-i18next'
import React, { useCallback } from 'react'
import { usePeriod } from 'Selectors/analyseSelectors'
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
	rulePeriod,
	dottedName,
	value,
	colours,
	unit
}) {
	const period = usePeriod()
	const debouncedSetFormValue = useCallback(debounce(750, setFormValue), [])
	const suffixed = unit != null && unit !== '%'
	const { language } = useTranslation().i18n

	const { thousandSeparator, decimalSeparator } = currencyFormat(language)

	return (
		<>
			<div css="width: 100%">
				<InputSuggestions
					suggestions={suggestions}
					onFirstClick={value => {
						setFormValue(value)
					}}
					onSecondClick={() => submit('suggestion')}
					rulePeriod={rulePeriod}
				/>
			</div>

			<div className="answer">
				<NumberFormat
					autoFocus
					className={classnames({ suffixed })}
					id={'step-' + dottedName}
					thousandSeparator={thousandSeparator}
					decimalSeparator={decimalSeparator}
					suffix={unit === '%' ? ' %' : ''}
					allowEmptyFormatting={true}
					style={{ border: `1px solid ${colours.textColourOnWhite}` }}
					onValueChange={({ floatValue }) => {
						debouncedSetFormValue(unit === '%' ? floatValue / 100 : floatValue)
					}}
					value={unit === '%' ? 100 * value : value}
				/>
				{suffixed && (
					<label className="suffix" htmlFor={'step-' + dottedName}>
						{unit}
						{rulePeriod && (
							<span>
								{' '}
								<T>par</T>{' '}
								<T>
									{
										{ mois: 'mois', année: 'an' }[
											rulePeriod === 'flexible' ? period : rulePeriod
										]
									}
								</T>
							</span>
						)}
					</label>
				)}
				<SendButton {...{ disabled: value === undefined, submit }} />
			</div>
		</>
	)
})
