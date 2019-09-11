import classnames from 'classnames'
import React, { useEffect, useRef, useState } from 'react'
import NumberFormat from 'react-number-format'
import { debounce } from '../../utils'
import './CurrencyInput.css'

let currencyFormat = language => ({
	isCurrencyPrefixed: !!Intl.NumberFormat(language, {
		style: 'currency',
		currency: 'EUR'
	})
		.format(12)
		.match(/€.*12/),

	thousandSeparator: Intl.NumberFormat(language)
		.format(1000)
		.charAt(1),

	decimalSeparator: Intl.NumberFormat(language)
		.format(0.1)
		.charAt(1)
})

function CurrencyInput({
	value,
	debounce: debounceTimeout,
	onChange,
	language,
	className,
	...forwardedProps
}) {
	const [currentValue, setCurrentValue] = useState(value)
	const [initialValue] = useState(value)
	useEffect(() => {
		setCurrentValue(value)
	}, [value])
	const nextValue = useRef(null)
	const onChangeDebounced = useRef(
		debounceTimeout ? debounce(debounceTimeout, onChange) : onChange
	)

	const handleChange = event => {
		// Only trigger the `onChange` event if the value has changed -- and not
		// only its formating, we don't want to call it when a dot is added in `12.`
		// for instance
		if (!nextValue.current) {
			return
		}
		event.persist()
		event.target = {
			...event.target,
			value: nextValue.current
		}
		nextValue.current = null
		onChangeDebounced.current(event)
	}

	const {
		isCurrencyPrefixed,
		thousandSeparator,
		decimalSeparator
	} = currencyFormat(language)

	// We display negative numbers iff this was the provided value (but we allow the user to enter them)
	const valueHasChanged = value !== initialValue

	// Autogrow the input
	const valueLength = (value || '').toString().length

	return (
		<div
			className={classnames(className, 'currencyInput__container')}
			{...(valueLength > 5
				? { style: { width: `${5 + (valueLength - 5) * 0.75}em` } }
				: {})}>
			{isCurrencyPrefixed && '€'}
			<NumberFormat
				{...forwardedProps}
				thousandSeparator={thousandSeparator}
				decimalSeparator={decimalSeparator}
				allowNegative={!valueHasChanged}
				className="currencyInput__input"
				inputMode="numeric"
				onValueChange={({ value }) => {
					setCurrentValue(value)
					nextValue.current = value.toString().replace(/^\-/, '')
				}}
				onChange={handleChange}
				value={(currentValue || '').toString().replace('.', decimalSeparator)}
			/>
			{!isCurrencyPrefixed && <>&nbsp;€</>}
		</div>
	)
}

export default CurrencyInput
