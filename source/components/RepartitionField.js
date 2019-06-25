import React from 'react'
import { debounce } from '../utils'
import './RepartitionField.css'

export default class RepartitionField extends React.Component {
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
				<span css="margin-right: 1rem;  ">
					{Math.round(this.state.value * 100)} /{' '}
					{Math.round(100 - this.state.value * 100)}
				</span>
				<input
					className="range"
					onChange={e => this.onChange(1 - e.target.value)}
					type="range"
					value={1 - this.state.value}
					name="volume"
					min="0.05"
					step="0.05"
					max="1"
				/>
			</div>
		)
	}
}
