import { normalizeDate, normalizeDateString } from 'Engine/date'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import InputSuggestions from './InputSuggestions'
import SendButton from './SendButton'

const DateField = styled.input`
	border: none;
	color: inherit;
	font-size: inherit;
	margin: 0 0.1rem;
	padding: 0;
	font-style: inherit;
	${({ placeholder = '' }) => css`
		width: ${placeholder.length * 0.78}rem;
	`}
`

export default function DateInput({ suggestions, onChange, onSubmit, value }) {
	const { language } = useTranslation().i18n

	// Refs for focus handling
	let monthInput = useRef<HTMLInputElement>(null)
	let yearInput = useRef<HTMLInputElement>(null)

	const [date, setDate] = useState({ day: '', month: '', year: '' })

	const handleDateChange = useCallback(
		newDate => setDate(oldDate => ({ ...oldDate, ...newDate })),
		[setDate]
	)

	const normalizedDate = useMemo(() => {
		if (!date.year || +date.year < 1700) {
			return false
		}
		try {
			return normalizeDate(+date.year, +date.month || 1, +date.day || 1)
		} catch (e) {
			return false
		}
	}, [date])

	// If date change, and is valid, set form value
	useEffect(() => {
		if (!normalizedDate) {
			return
		}
		onChange(normalizedDate)
	}, [normalizedDate])

	// If value change, replace state
	useEffect(() => {
		if (!value) {
			return
		}
		const [day, month, year] = value?.split('/')
		setDate({ day, month, year })
	}, [value, setDate])

	return (
		<>
			<div css="width: 100%">
				<InputSuggestions
					suggestions={suggestions}
					onFirstClick={value => {
						onChange(normalizeDateString(value as string))
					}}
					onSecondClick={() => onSubmit('suggestion')}
				/>
			</div>

			<div className="answer">
				<div className="ui__ input">
					<DateField
						autoFocus
						placeholder={language === 'fr' ? 'JJ' : 'DD'}
						css="text-align: right;"
						type="tel"
						onChange={({ target: { value } }) => {
							if (+value > 31) {
								return
							}
							if (value.length == 2) {
								monthInput.current?.select()
							}
							handleDateChange({ day: value })
						}}
						value={date.day}
					/>
					/
					<DateField
						type="tel"
						placeholder="MM"
						css="text-align: center;"
						ref={monthInput}
						onChange={({ target: { value } }) => {
							if (+value > 12) {
								return
							}
							if (value.length == 2) {
								yearInput.current?.select()
							}
							handleDateChange({ month: value })
						}}
						value={date.month}
					/>
					/
					<DateField
						type="tel"
						css="text-align: left;"
						ref={yearInput}
						placeholder={language === 'fr' ? 'AAAA' : 'YYYY'}
						onChange={({ target: { value } }) => {
							handleDateChange({ year: value })
						}}
						value={date.year}
					/>
				</div>
				{onSubmit && (
					<SendButton disabled={!normalizedDate} onSubmit={onSubmit} />
				)}
			</div>
		</>
	)
}
