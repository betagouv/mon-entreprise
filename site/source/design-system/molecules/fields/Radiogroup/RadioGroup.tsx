import {
	Label as RALabel,
	Radio as RARadio,
	RadioGroup as RARadioGroup,
	type RadioGroupProps as RARadioGroupProps,
} from 'react-aria-components'

type RadioGroupProps = RARadioGroupProps & {
	legend: string
	options: string[]
}

export function RadioGroup({ legend, options }: RadioGroupProps) {
	return (
		<RARadioGroup>
			<RALabel>{legend}</RALabel>

			{options.map((option) => (
				<RARadio key={option} value={option}>
					{option}
				</RARadio>
			))}
		</RARadioGroup>
	)
}
