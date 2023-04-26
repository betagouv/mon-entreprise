import { useCallback } from 'react'

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
	value,
}: InputProps) {
	const convertDate = (val?: unknown) => {
		if (!val || typeof val !== 'string') {
			return undefined
		}
		const [day, month, year] = val.split('/')

		return `${year}-${month}-${day}`
	}

	const handleDateChange = useCallback(
		(value?: string) => {
			if (!value) {
				return onChange(undefined)
			}
			onChange(value)
		},
		[onChange]
	)

	const dateValue = convertDate(value)

	return (
		<div className="step input">
			<div>
				{suggestions && (
					<InputSuggestions
						suggestions={suggestions}
						onFirstClick={(value) => {
							handleDateChange(
								'nodeValue' in value && typeof value.nodeValue === 'string'
									? value.nodeValue
									: undefined
							)
						}}
						onSecondClick={() => {
							onSubmit?.('suggestion')
						}}
					/>
				)}
				<DateField
					defaultSelected={
						missing || !dateValue ? undefined : new Date(dateValue)
					}
					isRequired={required}
					onChange={handleDateChange}
					aria-label={title}
					label={title}
				/>
			</div>
		</div>
	)
}
