import {
	Label as RALabel,
	Radio as RARadio,
	RadioGroup as RARadioGroup,
	RadioGroupProps as RARadioGroupProps,
} from 'react-aria-components'

export type ToggleOption = {
	label: string
	value: string
}

type ToggleGroupProps = RARadioGroupProps & {
	legend: string
	options: ToggleOption[]
}

export function ToggleGroup({
	legend,
	options,
	value,
	onChange,
}: ToggleGroupProps) {
	return (
		<RARadioGroup value={value} onChange={onChange}>
			<RALabel>{legend}</RALabel>

			{options.map((option) => (
				<RARadio value={option.value} key={`key-${option.value}`}>
					{option.label}
				</RARadio>
			))}
		</RARadioGroup>
	)
}
