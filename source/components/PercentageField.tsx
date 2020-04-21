import { formatValue } from 'Engine/format'
import React, { useCallback, useState } from 'react'
import { debounce as debounceFn } from '../utils'
import './PercentageField.css'

export default function PercentageField({ onChange, value, debounce = 0 }) {
	const [localValue, setLocalValue] = useState(value)
	const debouncedOnChange = useCallback(
		debounce ? debounceFn(debounce, onChange) : onChange,
		[debounce, onChange]
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
				{formatValue({
					value: localValue,
					unit: '%'
				})}
			</span>
		</div>
	)
}
