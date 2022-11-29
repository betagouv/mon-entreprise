import { useCallback, useMemo } from 'react'

import { InputProps } from '@/components/conversation/RuleInput'
import { DateField } from '@/design-system/field'

import InputSuggestions from './InputSuggestions'

export default function DateInput({
	suggestions,
	onChange,
	missing,
	title,
	onSubmit,
	required,
	autoFocus,
	value,
}: InputProps) {
	const dateValue = useMemo(() => {
		if (!value || typeof value !== 'string') {
			return undefined
		}
		const [day, month, year] = value.split('/')

		return `${year}-${month}-${day}`
	}, [value])
	// const [currentValue, setCurrentValue] = useState(dateValue)
	const handleDateChange = useCallback(
		(value: string) => {
			if (!value) {
				return onChange(undefined)
			}
			const [year, month, day] = value.split('-')
			if (+year < 1700) {
				return
			}
			if (year.length > 4) {
				return
			}
			if ([day, month, year].some((x) => Number.isNaN(+x))) {
				return
			}
			onChange(`${day}/${month}/${year}`)
		},
		[onChange]
	)

	return (
		<div className="step input">
			<div>
				{suggestions && (
					<InputSuggestions
						suggestions={suggestions}
						onFirstClick={(value) => {
							onChange(value)
						}}
						onSecondClick={() => onSubmit?.('suggestion')}
					/>
				)}
				<DateField
					value={missing ? undefined : dateValue}
					autoFocus={autoFocus}
					isRequired={required}
					onChange={handleDateChange}
					aria-label={title}
				/>
			</div>
		</div>
	)
}
