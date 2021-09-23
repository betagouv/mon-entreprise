import classnames from 'classnames'
import React, { useMemo, useRef, useState } from 'react'
import NumberFormat, { NumberFormatProps } from 'react-number-format'
import { currencyFormat, debounce } from '../../utils'
import './CurrencyInput.css'

type CurrencyInputProps = NumberFormatProps & {
	value?: string | number | null
	debounce?: number
	onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
	currencySymbol?: string
	language: string
}

export default function CurrencyInput({
	value,
	debounce: debounceTimeout,
	currencySymbol = '€',
	onChange,
	language,
	missing,
	className,
	style,
	dottedName,
	...forwardedProps
}: CurrencyInputProps) {
	const valueProp =
		typeof value === 'number' && Number.isNaN(value) ? '' : value ?? ''

	const [initialValue, setInitialValue] = useState(valueProp)
	const [currentValue, setCurrentValue] = useState(valueProp)

	const onChangeDebounced = useMemo(
		() =>
			debounceTimeout && onChange
				? debounce(debounceTimeout, onChange)
				: onChange,
		[onChange, debounceTimeout]
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
		if (!nextValue.current || /(\.$)|(^\.)|(-$)/.exec(nextValue.current)) {
			return
		}
		event.persist()
		event.target = {
			...event.target,
			value: nextValue.current,
		}
		nextValue.current = ''
		onChangeDebounced?.(event)
	}

	const { isCurrencyPrefixed, thousandSeparator, decimalSeparator } =
		currencyFormat(language)
	// Autogrow the input
	const valueLength = currentValue.toString().length
	const width = `${5 + (valueLength - 5) * 0.75}em`
	return (
		<div
			className={classnames(className, 'currencyInput__container')}
			style={{ ...(valueLength > 5 ? { width } : {}), ...style }}
			onFocus={() => inputRef.current?.select()}
			onClick={() => inputRef.current?.focus()}
		>
			{isCurrencyPrefixed && currentValue == '' && <>€&nbsp;</>}

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
					nextValue.current = value
						.toString()
						.replace(/^0+(.*)$/, '$1')
						.replace(/^$/, '0')
				}}
				onChange={handleChange}
				value={currentValue != null ? currentValue : ''}
				autoComplete="off"
			/>
			{!isCurrencyPrefixed && <>&nbsp;€</>}
		</div>
	)
}
