import React from 'react'
import { ChromePicker } from 'react-color'

export default function ColorPicker({ colour, onChange }) {
	return (
		<div style={{ display: 'flex', justifyContent: 'center', margin: '1rem' }}>
			<ChromePicker
				color={colour}
				onChangeComplete={color => onChange(color.hex)}
			/>
		</div>
	)
}
