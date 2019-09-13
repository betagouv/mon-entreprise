import React, { useCallback, useState } from 'react'
import './PercentageField.css'

export default function PercentageField({ onChange, value, debounce }) {
	const [localValue, setLocalValue] = useState(value)
	const debouncedOnChange = useCallback(
		debounce ? debounce(debounce, onChange) : onChange
	)

	return (
		<div>
			<input
				className="range"
				onChange={e => {
					const value = e.target.value
					setLocalValue(value)
					debouncedOnChange(value)
				}}
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
