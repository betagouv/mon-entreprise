import classnames from 'classnames'
import { omit } from 'ramda'
import React, { Component } from 'react'
import NumberFormat from 'react-number-format'
import { debounce } from '../../utils'
import './ValueInput.css'

let currencyFormat = language => ({
	isUnitPrefixed: !!Intl.NumberFormat(language, {
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

let defaultFormat = language => ({
	...currencyFormat(language),
	isUnitPrefixed: false
})

const formatter = unit => (unit === '€' ? currencyFormat : defaultFormat)

class ValueInput extends Component {
	state = {
		value: this.props.value,
		initialValue: this.props.value
	}

	onChange = this.props.debounce
		? debounce(this.props.debounce, this.props.onChange)
		: this.props.onChange

	handleNextChange = false
	value = undefined
	handleChange = event => {
		// Only trigger the `onChange` event if the value has changed -- and not
		// only its formating, we don't want to call it when a dot is added in `12.`
		// for instance
		if (!this.handleNextChange || !this.onChange) {
			return
		}
		this.handleNextChange = false
		event.persist()
		event.target = {
			...event.target,
			value: this.value
		}
		this.onChange(event)
	}

	// See https://reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#alternative-1-reset-uncontrolled-component-with-an-id-prop
	static getDerivedStateFromProps({ value }, { initialValue }) {
		if (value !== initialValue) {
			return { value, initialValue: value }
		}
		return null
	}

	render() {
		let forwardedProps = omit(
			['onChange', 'defaultValue', 'language', 'className', 'value'],
			this.props
		)
		const unit = this.props.unit
		const { isUnitPrefixed, thousandSeparator, decimalSeparator } = formatter(
			unit
		)(this.props.language)

		// We display negative numbers iff this was the provided value (but we allow the user to enter them)
		const valueHasChanged = this.state.value !== this.state.initialValue

		// Autogrow the input
		const valueLength = (this.state.value || '').toString().length

		return (
			<div
				className={classnames(this.props.className, 'valueInput__container')}
				{...(valueLength > 5
					? { style: { width: `${5 + (valueLength - 5) * 0.75}em` } }
					: {})}>
				{isUnitPrefixed && unit}
				<NumberFormat
					{...forwardedProps}
					thousandSeparator={thousandSeparator}
					decimalSeparator={decimalSeparator}
					allowNegative={!valueHasChanged}
					className="valueInput__input"
					inputMode="numeric"
					onValueChange={({ value }) => {
						this.setState({ value })
						this.value = value.toString().replace(/^\-/, '')
						this.handleNextChange = true
					}}
					onChange={this.handleChange}
					value={(this.state.value || '')
						.toString()
						.replace('.', decimalSeparator)}
				/>
				{!isUnitPrefixed && <>&nbsp;{unit}</>}
			</div>
		)
	}
}

export default ValueInput
