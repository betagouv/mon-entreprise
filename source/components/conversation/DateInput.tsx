import { normalizeDateString } from 'Engine/date'
import { RuleInputProps } from 'Engine/RuleInput'
import { Rule } from 'Engine/types'
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
		const [day, month, year] = normalizeDateString(value).split('/')
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
			onChange(`${day}/${month}/${year}`)
		},
		[onChange]
	)
	return (
		<>
			<div css="width: 100%">
				<InputSuggestions
					suggestions={suggestions}
					onFirstClick={value => {
						onChange(normalizeDateString(value as string))
					}}
					onSecondClick={() => onSubmit?.('suggestion')}
				/>
			</div>
			<div className="answer">
				<DateStyledInput
					className="ui__ input"
					type="date"
					value={dateValue}
					onChange={handleDateChange}
				/>
				{onSubmit && <SendButton disabled={!dateValue} onSubmit={onSubmit} />}
			</div>
		</>
	)
}

const DateStyledInput = styled.input`
	font-family: 'Roboto', sans-serif;
	text-transform: uppercase;
	height: inherit;
`
