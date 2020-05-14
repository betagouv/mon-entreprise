import { RuleInputProps } from 'Components/conversation/RuleInput'
import { Rule } from 'publicodes'
import React, { useCallback, useMemo } from 'react'
import styled from 'styled-components'
import InputSuggestions from './InputSuggestions'
import SendButton from './SendButton'

type DateInputProps = {
	onChange: RuleInputProps['onChange']
	onSubmit: RuleInputProps['onSubmit']
	value: RuleInputProps['value']
	suggestions: Rule['suggestions']
}

export default function DateInput({
	suggestions,
	onChange,
	onSubmit,
	value
}: DateInputProps) {
	const dateValue = useMemo(() => {
		if (!value || typeof value !== 'string') return undefined
		const [day, month, year] = value.split('/')
		return `${year}-${month}-${day}`
	}, [value])

	const handleDateChange = useCallback(
		evt => {
			if (!evt.target.value) {
				return onChange(null)
			}
			const [year, month, day] = evt.target.value.split('-')
			if (+year < 1700) {
				return
			}
			if ([day, month, year].some(x => Number.isNaN(+x))) {
				return
			}
			onChange(`${day}/${month}/${year}`)
		},
		[onChange]
	)
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
				<DateStyledInput
					className="ui__ input suffixed"
					type="date"
					value={dateValue}
					onChange={handleDateChange}
				/>
			</div>
			{onSubmit && <SendButton disabled={!dateValue} onSubmit={onSubmit} />}
		</div>
	)
}

const DateStyledInput = styled.input`
	font-family: 'Roboto', sans-serif;
	text-transform: uppercase;
	height: inherit;
`
