import classnames from 'classnames'
import { currencyFormat } from 'Engine/format'
import React, { useRef, useState } from 'react'
import NumberFormat, { NumberFormatProps } from 'react-number-format'
import { debounce } from '../../utils'
import './CurrencyInput.css'

type CurrencyInputProps = NumberFormatProps & {
	value?: string | number
	debounce?: number
	onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
	currencySymbol?: string
	language?: Parameters<typeof currencyFormat>[0]
}

export default function CurrencyInput({
	value: valueProp = '',
	debounce: debounceTimeout,
	currencySymbol = '€',
	onChange,
	onSubmit,
	language,
	className,
	...forwardedProps
}: CurrencyInputProps) {
	const [initialValue, setInitialValue] = useState(valueProp)
	const [currentValue, setCurrentValue] = useState(valueProp)
	const onChangeDebounced = useRef(
		debounceTimeout && onChange ? debounce(debounceTimeout, onChange) : onChange
	)
	// We need some mutable reference because the <NumberFormat /> component doesn't provide
	// the DOM `event` in its custom `onValueChange` handler
	const nextValue = useRef('')

	const inputRef = useRef<HTMLInputElement>()

	// When the component is rendered with a new "value" prop, we reset our local
	// state
	if (valueProp !== initialValue) {
		setCurrentValue(valueProp)
		setInitialValue(valueProp)
	}

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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
		nextValue.current = ''
		onChangeDebounced.current?.(event)
	}

	const {
		isCurrencyPrefixed,
		thousandSeparator,
		decimalSeparator
	} = currencyFormat(language)
	// We display negative numbers iff this was the provided value (but we disallow the user to enter them)
	const valueHasChanged = currentValue !== initialValue

	// Autogrow the input
	const valueLength = currentValue.toString().length
	const width = `${5 + (valueLength - 5) * 0.75}em`

	return (
		<div
			className={classnames(className, 'currencyInput__container')}
			{...(valueLength > 5 ? { style: { width } } : {})}
			onClick={() => inputRef.current?.focus()}
		>
			{!currentValue && isCurrencyPrefixed && currencySymbol}
			<NumberFormat
				{...forwardedProps}
				thousandSeparator={thousandSeparator}
				decimalSeparator={decimalSeparator}
				allowNegative
				className="currencyInput__input"
				inputMode="numeric"
				getInputRef={inputRef}
				prefix={
					isCurrencyPrefixed && currencySymbol ? `${currencySymbol} ` : ''
				}
				onValueChange={({ value }) => {
					setCurrentValue(value)
					nextValue.current = value.toString().replace('-', '')
				}}
				onChange={handleChange}
				value={currentValue.toString().replace('.', decimalSeparator)}
				autoComplete="off"
			/>
			{!isCurrencyPrefixed && <>&nbsp;€</>}
		</div>
	)
}
