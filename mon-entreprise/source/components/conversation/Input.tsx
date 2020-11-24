import { formatValue } from 'publicodes'
import { Unit } from 'publicodes/dist/types/AST/types'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import NumberFormat from 'react-number-format'
import { serialize } from 'storage/serializeSimulation'
import { currencyFormat, debounce } from '../../utils'
import InputSuggestions from './InputSuggestions'
import { InputCommonProps } from './RuleInput'

// TODO: fusionner Input.js et CurrencyInput.js
export default function Input({
	suggestions,
	onChange,
	onSubmit,
	id,
	value,
	missing,
	unit,
	autoFocus
}: InputCommonProps & {
	onSubmit: (source: string) => void
	unit: Unit | undefined
}) {
	const debouncedOnChange = useCallback(debounce(550, onChange), [])
	const { language } = useTranslation().i18n
	const unité = formatValue({ nodeValue: value ?? 0, unit }, { language })
		.replace(/[\d,.]/g, '')
		.trim()
	const { thousandSeparator, decimalSeparator } = currencyFormat(language)
	// const [currentValue, setCurrentValue] = useState(value)
	return (
		<div className="step input">
			<div>
				<InputSuggestions
					suggestions={suggestions}
					onFirstClick={value => {
						onChange(value)
					}}
					onSecondClick={() => onSubmit?.('suggestion')}
				/>
				<NumberFormat
					autoFocus={autoFocus}
					className="suffixed ui__"
					id={id}
					placeholder={missing && value}
					thousandSeparator={thousandSeparator}
					decimalSeparator={decimalSeparator}
					allowEmptyFormatting={true}
					// We don't want to call `onValueChange` in case this component is
					// re-render with a new "value" prop from the outside.
					onValueChange={({ floatValue }) => {
						if (floatValue !== value) {
							debouncedOnChange({ valeur: floatValue, unité })
						}
					}}
					value={!missing && value}
					autoComplete="off"
				/>
				<span className="suffix">&nbsp;{unité}</span>
			</div>
		</div>
	)
}
