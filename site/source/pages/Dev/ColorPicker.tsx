import { ChromePicker } from 'react-color'

type ColorPickerProps = {
	color: string | undefined
	onChange: (color: string) => void
}

export default function ColorPicker({ color, onChange }: ColorPickerProps) {
	return (
		<ChromePicker
			color={color}
			onChangeComplete={(color) => onChange(color.hex)}
		/>
	)
}
