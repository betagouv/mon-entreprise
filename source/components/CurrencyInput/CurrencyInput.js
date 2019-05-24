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
		.charAt(1)
})

class CurrencyInput extends Component {
	state = {
		value: this.props.storeValue
	}
	onChange = this.props.debounce
		? debounce(this.props.debounce, this.props.onChange)
		: this.props.onChange

	componentDidUpdate(prevProps) {
		if (
			prevProps.storeValue !== this.props.storeValue &&
			this.props.storeValue !== this.state.value
		) {
			this.setState({ value: this.props.storeValue })
		}
	}

	render() {
		let forwardedProps = omit(
			['onChange', 'defaultValue', 'language', 'className', 'value', 'normalizedValueRef'],
			this.props
		)

		const { isCurrencyPrefixed, thousandSeparator } = currencyFormat(
			this.props.language
		)

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
					className="currencyInput__input"
					inputMode="numeric"
					onValueChange={({ value }) => {
						this.setState({ value })
						this.props.normalizedValueRef.current = value
					}}
					onChange={this.onChange}
					value={this.state.value}
				/>
				{!isCurrencyPrefixed && <>&nbsp;€</>}
			</div>
		)
	}
}

export default CurrencyInput
