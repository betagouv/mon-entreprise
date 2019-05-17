import classnames from 'classnames'
import { omit } from 'ramda'
import React, { Component } from 'react'
import { debounce, isIE } from '../../utils'
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
		value: this.props.defaultValue
	}
	onChange = this.props.debounce
		? debounce(this.props.debounce, this.props.onChange)
		: this.props.onChange
	input = React.createRef()

	getSnapshotBeforeUpdate = () => {
		if (!this.input.current) {
			return
		}
		return this.input.current.selectionStart
	}
	componentDidMount() {
		this.adaptInputSize()
	}
	adaptInputSize = () => {
		// Because ch mesurement in IE is not consistent with other browsers, we have to apply a multiplier
		// https://stackoverflow.com/questions/17825638/css3-ch-unit-inconsistent-between-ie9-and-other-browsers
		const widthMultiplier = isIE() ? 1.4 : 1

		if (this.input.current && isCurrencyPrefixed(this.props.language))
			this.input.current.style.width =
				widthMultiplier * (this.input.current.value.length + 0.2) + 'ch'
	}
	componentDidUpdate = (_, __, cursorPosition) => {
		if (!this.input.current) {
			return
		}
		this.input.current.selectionStart = cursorPosition
		this.input.current.selectionEnd = cursorPosition
		this.adaptInputSize()
	}
	handleChange = event => {
		let value = event.target.value
		value = value
			.replace(/,/g, '.')
			.replace(/[^\d.]/g, '')
			.replace(/\.(.*)\.(.*)/g, '$1.$2')
		this.setState({ value }, this.adaptInputSize)

		if (value.endsWith('.')) {
			return
		}
		event.target.value = value

		if (event.persist) {
			event.persist()
		}
		this.onChange(event)
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
