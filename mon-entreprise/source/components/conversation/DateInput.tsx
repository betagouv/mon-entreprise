import { InputProps } from 'Components/conversation/RuleInput'
import { useCallback, useMemo } from 'react'
import styled from 'styled-components'
import InputSuggestions from './InputSuggestions'

export default function DateInput({
	suggestions,
	onChange,
	id,
	onSubmit,
	required,
	value,
}: InputProps) {
	const dateValue = useMemo(() => {
		if (!value || typeof value !== 'string') return undefined
		const [day, month, year] = value.split('/')
		return `${year}-${month}-${day}`
	}, [value])

	const handleDateChange = useCallback(
		(evt) => {
			if (!evt.target.value) {
				return
			}
			const [year, month, day] = evt.target.value.split('-')
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
				<DateStyledInput
					className="ui__ input"
					id={id}
					type="date"
					value={dateValue}
					required={required}
					onChange={handleDateChange}
				/>
			</div>
		</div>
	)
}

const DateStyledInput = styled.input`
	font-family: 'Roboto', sans-serif;
	text-transform: uppercase;
	height: inherit;
`
