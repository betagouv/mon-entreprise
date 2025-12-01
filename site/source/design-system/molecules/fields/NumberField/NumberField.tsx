import {
	Group as RAGroup,
	Input as RAInput,
	Label as RALabel,
	NumberField as RANumberField,
	type NumberFieldProps as RANumberFieldProps,
} from 'react-aria-components'

type NumberFieldProps = RANumberFieldProps & {
	displayedUnit?: string
	label: string
}

export function NumberField({ displayedUnit, label }: NumberFieldProps) {
	return (
		<RANumberField>
			<RALabel>{label}</RALabel>

			<RAGroup>
				<RAInput />

				{displayedUnit && <span>{displayedUnit}</span>}
			</RAGroup>
		</RANumberField>
	)
}
