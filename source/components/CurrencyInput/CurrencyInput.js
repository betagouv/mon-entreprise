import classnames from 'classnames'
import { omit } from 'ramda'
import React, { Component } from 'react'
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

class CurrencyInput extends Component {
	state = {
		value: this.props.value || '',
		valueHasChanged: false,
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
		if (!this.handleNextChange) {
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

	render() {
		let forwardedProps = omit(
			['onChange', 'defaultValue', 'language', 'className', 'value'],
			this.props
		)

		const {
			isCurrencyPrefixed,
			thousandSeparator,
			decimalSeparator
		} = currencyFormat(this.props.language)

		return (
			<div
				className={classnames(
					this.props.className,
					'currencyInput__container'
				)}>
				{isCurrencyPrefixed && '€'}
				<NumberFormat
					{...forwardedProps}
					thousandSeparator={thousandSeparator}
					decimalSeparator={decimalSeparator}
					allowNegative={!this.state.valueHasChanged}
					className="currencyInput__input"
					inputMode="numeric"
					onValueChange={({ value }) => {
						this.setState({valueHasChanged: true, value})
						this.value = value.toString().replace(/^\-/,'')
						this.handleNextChange = true
					}}
					onChange={this.handleChange}
					value={this.state.value.toString()
						.replace('.', decimalSeparator)}
				/>
				{!isCurrencyPrefixed && <>&nbsp;€</>}
			</div>
		)
	}
}

export default CurrencyInput
