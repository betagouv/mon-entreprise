import { type NumberFieldProps as RANumberFieldProps } from 'react-aria-components'

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
	suggestions?: InputSuggestionsRecord<number>
	unit: UnitéMonétaire
	onSubmit?: (source?: string) => void
}

export function AmountField({
	defaultValue,
	description,
	unit,
	errorMessage,
	label,
	suggestions,
}: AmountFieldProps) {
	return (
		<NumberField
			defaultValue={defaultValue}
			description={description}
			displayedUnit={UNIT_TO_DISPLAY[unit]}
			errorMessage={errorMessage}
			label={label}
			suggestions={suggestions}
		/>
	)
}
