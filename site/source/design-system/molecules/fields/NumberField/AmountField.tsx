import { NumberField, type NumberFieldProps } from './NumberField'

export function AmountField({
	defaultValue,
	description,
	displayedUnit,
	errorMessage,
	label,
	suggestions,
}: NumberFieldProps) {
	return (
		<NumberField
			defaultValue={defaultValue}
			description={description}
			displayedUnit={displayedUnit}
			errorMessage={errorMessage}
			label={label}
			suggestions={suggestions}
		/>
	)
}
