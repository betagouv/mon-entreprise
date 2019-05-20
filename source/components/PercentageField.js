import React from 'react'
import { debounce } from '../utils'
import './PercentageField.css'

export default class PercentageField extends React.Component {
	debouncedOnChange = this.props.debounce
		? debounce(this.props.debounce, this.props.input.onChange)
		: this.props.input.onChange
	state = {
		value: this.props.input?.value
	}
	onChange(value) {
		this.setState({ value })
		this.debouncedOnChange(value)
	}
	render() {
		return (
			<div>
				<input
					className="range"
					onChange={e => this.onChange(e.target.value)}
					type="range"
					value={this.state.value}
					name="volume"
					min="0"
					step="0.05"
					max="1"
				/>
				<span style={{ display: 'inline-block', width: '3em' }}>
					{Math.round(this.state.value * 100)} %
				</span>
			</div>
		)
	}
}
