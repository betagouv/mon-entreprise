import classnames from 'classnames'
import { omit } from 'ramda'
import React, { Component } from 'react'
import { debounce } from '../../utils'
import './CurrencyInput.css'

let isCurrencyPrefixed = language =>
	!!Intl.NumberFormat(language, {
		style: 'currency',
		currency: 'EUR'
	})
		.format(12)
		.match(/€.*12/)

class CurrencyInput extends Component {
	state = {
		value: this.props.storeValue
	}
	onChange = this.props.debounce
		? debounce(this.props.debounce, this.props.onChange)
		: this.props.onChange
	input = React.createRef()

	handleChange = event => {
		let value = event.target.value
		value = value
			.replace(/,/g, '.')
			.replace(/[^\d.]/g, '')
			.replace(/\.(.*)\.(.*)/g, '$1.$2')
		this.setState({ value })

		if (value.endsWith('.')) {
			return
		}
		event.target.value = value

		if (event.persist) {
			event.persist()
		}
		this.onChange(event)
	}
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
			['onChange', 'defaultValue', 'language', 'className', 'value'],
			this.props
		)

		return (
			<div
				className={classnames(
					this.props.className,
					'currencyInput__container'
				)}>
				{isCurrencyPrefixed(this.props.language) && '€'}
				<input
					{...forwardedProps}
					className="currencyInput__input"
					inputMode="numeric"
					onChange={this.handleChange}
					ref={this.input}
					value={this.state.value}
				/>
				{!isCurrencyPrefixed(this.props.language) && <>&nbsp;€</>}
			</div>
		)
	}
}

export default CurrencyInput
