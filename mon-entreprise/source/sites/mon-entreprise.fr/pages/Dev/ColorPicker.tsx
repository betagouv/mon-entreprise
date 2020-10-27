import { ChromePicker, ChromePickerProps } from 'react-color'

type ColorPickerProps = {
	color: ChromePickerProps['color']
	onChange: (color: string) => void
}

export default function ColorPicker({ color, onChange }: ColorPickerProps) {
	return (
		<ChromePicker
			color={color}
			onChangeComplete={color => onChange(color.hex)}
		/>
	)
}
