import React from 'react'
import { ChromePicker } from 'react-color'

export default function ColorPicker({ color, onChange }) {
	return (
		<div style={{ display: 'flex', justifyContent: 'center', margin: '1rem' }}>
			<ChromePicker
				color={color}
				onChangeComplete={color => onChange(color.hex)}
			/>
		</div>
	)
}
