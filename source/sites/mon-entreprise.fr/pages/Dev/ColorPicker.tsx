import React from 'react'
import { ChromePicker } from 'react-color'

export default function ColorPicker({ color, onChange }) {
	return (
		<ChromePicker
			color={color}
			onChangeComplete={color => onChange(color.hex)}
		/>
	)
}
