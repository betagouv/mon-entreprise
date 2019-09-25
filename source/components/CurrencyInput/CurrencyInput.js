import classnames from 'classnames'
import React, { useRef, useState } from 'react'
import { currencyFormat } from 'Engine/format'
import NumberFormat from 'react-number-format'
import { debounce } from '../../utils'
import './CurrencyInput.css'

export default function CurrencyInput({
	value: valueProp = '',
	debounce: debounceTimeout,
	currencySymbol = '€',
	onChange,
	language,
	className,
	...forwardedProps
}) {
	const [initialValue, setInitialValue] = useState(valueProp)
	const [currentValue, setCurrentValue] = useState(valueProp)
	const onChangeDebounced = useRef(
		debounceTimeout ? debounce(debounceTimeout, onChange) : onChange
	)
	// We need some mutable reference because the <NumberFormat /> component doesn't provide
	// the DOM `event` in its custom `onValueChange` handler
	const nextValue = useRef(null)

	const inputRef = useRef()

	// When the component is rendered with a new "value" prop, we reset our local state
	if (valueProp !== initialValue) {
		setCurrentValue(valueProp)
		setInitialValue(valueProp)
	}

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
	console.log({ isCurrencyPrefixed })
	// We display negative numbers iff this was the provided value (but we disallow the user to enter them)
	const valueHasChanged = currentValue !== initialValue

	// Autogrow the input
	const valueLength = currentValue.toString().length
	const width = `${5 + (valueLength - 5) * 0.75}em`

	return (
		<div
			className={classnames(className, 'currencyInput__container')}
			{...(valueLength > 5 ? { style: { width } } : {})}
			onClick={() => inputRef.current.focus()}>
			{!currentValue && isCurrencyPrefixed && currencySymbol}
			<NumberFormat
				{...forwardedProps}
				thousandSeparator={thousandSeparator}
				decimalSeparator={decimalSeparator}
				allowNegative={!valueHasChanged}
				className="currencyInput__input"
				inputMode="numeric"
				getInputRef={inputRef}
				prefix={
					isCurrencyPrefixed && currencySymbol ? `${currencySymbol} ` : ''
				}
				onValueChange={({ value }) => {
					setCurrentValue(value)
					nextValue.current = value.toString().replace(/^-/, '')
				}}
				onChange={handleChange}
				value={currentValue.toString().replace('.', decimalSeparator)}
			/>
			{!isCurrencyPrefixed && <>&nbsp;€</>}
		</div>
	)
}
