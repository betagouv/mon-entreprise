import classnames from 'classnames'
import { dissoc } from 'ramda'
import React, { Component } from 'react'
import { isIE } from '../../utils'
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
		value: ''
	}
	static getDerivedStateFromProps(nextProps) {
		return {
			value: nextProps.value
		}
	}
	shouldComponentUpdate(nextProps, nextState) {
		return (
			this.state.value !== nextState.value ||
			this.props.language !== nextProps.language
		)
	}
	getSnapshotBeforeUpdate = () => {
		return this.input.selectionStart
	}
	componentDidMount() {
		this.adaptInputSize()
	}
	adaptInputSize = () => {
		// Because ch mesurement in IE is not consistent with other browsers, we have to apply a multiplier
		// https://stackoverflow.com/questions/17825638/css3-ch-unit-inconsistent-between-ie9-and-other-browsers
		const widthMultiplier = isIE() ? 1.4 : 1
		if (this.input && isCurrencyPrefixed(this.props.language))
			this.input.style.width =
				widthMultiplier * (this.input.value.length + 0.2) + 'ch'
	}
	componentDidUpdate = (_, __, cursorPosition) => {
		this.input.selectionStart = cursorPosition
		this.input.selectionEnd = cursorPosition

		this.adaptInputSize()
	}
	focusInput = () => {
		this.input.focus()
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
		if (this.props.onChange && value !== this.props.value) {
			event.target.value = value
			this.props.onChange(event)
		}
	}

	render() {
		let forwardedProps = dissoc(
			['onChange', 'value', 'language', 'className'],
			this.props
		)
		return (
			<div
				onClick={this.focusInput}
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
					ref={ref => (this.input = ref)}
					// value={this.state.value}
				/>
				{!isCurrencyPrefixed(this.props.language) && <>&nbsp;€</>}
			</div>
		)
	}
}

export default CurrencyInput
