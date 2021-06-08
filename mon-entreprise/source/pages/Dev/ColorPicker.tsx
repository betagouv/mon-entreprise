import HSL from "Components/utils/color/HSL"
import HSLInterface from "Components/utils/color/HSLInterface"
import { ChromePicker, HSLColor } from 'react-color'

type ColorPickerProps = {
	color: HSLInterface
	onChange: (color: HSLInterface) => void
}

export default function ColorPicker({ color, onChange }: ColorPickerProps) {
	return (
		<ChromePicker
			color={color as HSLColor}
			onChangeComplete={(color) => onChange(Object.assign(new HSL(), color.hsl))}
		/>
	)
}
