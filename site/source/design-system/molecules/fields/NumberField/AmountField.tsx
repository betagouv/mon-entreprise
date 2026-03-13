import { type NumberFieldProps as RANumberFieldProps } from 'react-aria-components'

import { Montant } from '@/domaine/Montant'
import { UnitéMonétaire } from '@/domaine/Unités'

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
	'defaultValue' | 'formatOptions'
> & {
	description?: string
	displayedUnit?: string
	errorMessage?: string
	label: string
	placeholder?: string
	suggestions?: InputSuggestionsRecord<number>
	unit: UnitéMonétaire
	value: UnitéMonétaire | undefined
	withCents?: boolean
	onSubmit?: (source?: string) => void
}

export function AmountField({
	defaultValue,
	description,
	errorMessage,
	label,
	placeholder,
	suggestions,
	unit,
	withCents = false,
}: AmountFieldProps) {
	return (
		<NumberField
			defaultValue={defaultValue}
			description={description}
			displayedUnit={UNIT_TO_DISPLAY[unit]}
			formatOptions={{
				minimumFractionDigits: 0,
				maximumFractionDigits: withCents ? 2 : 0,
			}}
			errorMessage={errorMessage}
			label={label}
			placeholder={placeholder}
			suggestions={suggestions}
		/>
	)
}
