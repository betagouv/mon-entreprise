import { NumericInput } from '../../atoms/NumericInput'

interface NumberFieldProps {
	id?: string
	value?: number
	onChange?: (value?: number) => void
	onSubmit?: (source?: string) => void
	label?: React.ReactNode
	small?: boolean
	description?: React.ReactNode
	placeholder?: number
	formatOptions?: Intl.NumberFormatOptions
	errorMessage?: React.ReactNode
	validationState?: 'valid' | 'invalid'
	suggestions?: Record<string, number>

	aria?: {
		labelledby?: string
	}
}

/**
 * Composant de saisie numérique générique pour les nombres sans unité spécifique.
 *
 * Pour les montants monétaires, utilisez MontantField.
 * Pour les quantités avec unités, utilisez QuantitéField.
 */
export const NumberField = ({
	id,
	value,
	onChange,
	onSubmit,
	label,
	small,
	description,
	placeholder,
	formatOptions,
	errorMessage,
	validationState,
	suggestions,
	aria,
}: NumberFieldProps) => {
	return (
		<NumericInput
			id={id}
			value={value}
			onChange={onChange}
			onSubmit={onSubmit}
			label={label}
			small={small}
			description={description}
			placeholder={placeholder}
			formatOptions={formatOptions}
			errorMessage={errorMessage}
			validationState={validationState}
			suggestions={suggestions}
			aria-labelledby={aria?.labelledby}
		/>
	)
}
