import React from 'react'
import { debounce } from '../utils'
import './PercentageField.css'

export default class extends React.Component {
	onChange = this.props.debounce
		? debounce(this.props.debounce, this.props.input.onChange)
		: this.props.input.onChange

	render() {
		let {
			input: { value }
		} = this.props

		return (
			<div>
				<input
					className="range"
					onChange={e => this.onChange(e.target.value)}
					value={value}
					type="range"
					name="volume"
					min="0"
					step="0.1"
					max="1"
				/>
				<span style={{ display: 'inline-block', width: '3em' }}>
					{value * 100} %
				</span>
			</div>
		)
	}
}
