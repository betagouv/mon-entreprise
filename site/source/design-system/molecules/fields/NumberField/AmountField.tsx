import * as Record from 'effect/Record'
import { type NumberFieldProps as RANumberFieldProps } from 'react-aria-components'

import { Montant, montant } from '@/domaine/Montant'
import { type UnitéMonétaire } from '@/domaine/Unites'

import { InputSuggestionsRecord } from '../../../suggestions'
import { NumberField } from './NumberField'

const UNIT_TO_DISPLAY: Record<UnitéMonétaire, string> = {
	'€': '€',
	'€/an': '€ par an',
	'€/mois': '€ par mois',
	'€/jour': '€ par jour',
	'€/heure': '€ par heure',
	'€/titre-restaurant': '€ par titre-restaurant',
}

export type AmountFieldProps = Pick<
	RANumberFieldProps,
	'formatOptions'
> & {
	defaultMontant: Montant | undefined
	description?: string
	displayedUnit?: string
	errorMessage?: string
	label: string
	placeholder?: string
	suggestionsDeMontants?: InputSuggestionsRecord<Montant>
	unit: UnitéMonétaire
	withCents?: boolean
	onChange?: (montant: Montant) => void
}

export function AmountField({
	defaultMontant,
	description,
	errorMessage,
	label,
	placeholder,
	suggestionsDeMontants,
	unit,
	withCents = false,
	onChange,
}: AmountFieldProps) {
	const { valeur, unité } = defaultMontant ?? { valeur: undefined, unité: unit }

	const handleChange = (valeur: number) => {
		onChange?.(montant(valeur, unit))
	}

	// TODO: si l'unité fournie (unit) ne correspond pas à l'unité de defaultMontant
	// et/ou des suggestions, il faut convertir defaultMontant et les suggestions
	// pour les afficher dans l'unité fournie 'unit'

	const suggestionsDeValeurs = suggestionsDeMontants && Record.map(suggestionsDeMontants, (montant) => montant.valeur)

	return (
		<NumberField
			defaultValue={valeur}
			description={description}
			displayedUnit={UNIT_TO_DISPLAY[unité]}
			formatOptions={{
				minimumFractionDigits: withCents ? 2 : 0,
				maximumFractionDigits: withCents ? 2 : 0,
			}}
			errorMessage={errorMessage}
			label={label}
			onChange={handleChange}
			placeholder={placeholder}
			suggestions={suggestionsDeValeurs}
		/>
	)
}
