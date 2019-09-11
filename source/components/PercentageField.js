import React, { useState } from 'react'
import './PercentageField.css'

export default function PercentageField({ input, debounce }) {
	const [localValue, setLocalValue] = useState(input?.value)

	const debouncedOnChange = debounce
		? debounce(debounce, input.onChange)
		: input.onChange

	const onChange = value => {
		setLocalValue(value)
		debouncedOnChange(value)
	}

	return (
		<div>
			<input
				className="range"
				onChange={e => onChange(e.target.value)}
				type="range"
				value={localValue}
				name="volume"
				min="0"
				step="0.05"
				max="1"
			/>
			<span style={{ display: 'inline-block', width: '3em' }}>
				{Math.round(localValue * 100)} %
			</span>
		</div>
	)
}
