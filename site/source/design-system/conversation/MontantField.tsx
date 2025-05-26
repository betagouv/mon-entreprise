import { styled } from 'styled-components'

import { NumberField } from '@/design-system'
import { InputSuggestions } from '@/design-system/suggestions/InputSuggestions'
import { montant, Montant, UnitéMonétaire } from '@/domaine/Montant'
import { useSelection } from '@/hooks/UseSelection'
import { NoOp } from '@/utils/NoOp'

interface MontantFieldProps<U extends UnitéMonétaire> {
	value: Montant<U> | undefined
	unité: U
	onChange?: (value: Montant<U> | undefined) => void
	placeholder?: Montant<U>
	onSubmit?: (source?: string) => void
	suggestions?: Record<string, Montant<U>>
	showSuggestions?: boolean
	avecCentimes?: boolean

	id?: string
	description?: string

	aria?: {
		labelledby?: string
		label?: string
	}
}

export default function MontantField<U extends UnitéMonétaire>({
	value,
	unité,
	suggestions,
	onChange = NoOp,
	onSubmit,
	placeholder,
	avecCentimes = false,
	showSuggestions,
	id,
	aria,
}: MontantFieldProps<U>) {
	const { handleChange, currentSelection: currentValue } = useSelection({
		value,
		onChange,
	})

	const handleValueChange = (valeur: number | undefined) => {
		handleChange(
			valeur === undefined
				? undefined
				: currentValue
				? { ...currentValue, valeur }
				: montant<U>(valeur, unité)
		)
	}

	return (
		<StyledNumberInput>
			<NumberField
				id={id}
				aria-labelledby={aria?.labelledby}
				aria-label={aria?.label}
				description={''}
				onChange={handleValueChange}
				formatOptions={{
					style: 'currency',
					currency: 'EUR',
					minimumFractionDigits: avecCentimes ? 2 : 0,
					maximumFractionDigits: avecCentimes ? 2 : 0,
				}}
				placeholder={placeholder?.valeur}
				value={currentValue?.valeur}
			/>
			{showSuggestions && suggestions && (
				<InputSuggestions<Montant<U>>
					className="print-hidden"
					suggestions={suggestions}
					onFirstClick={(montantSuggestion: Montant<U>) => {
						handleChange(montantSuggestion)
					}}
					onSecondClick={() => onSubmit?.('suggestion')}
				/>
			)}
		</StyledNumberInput>
	)
}
const StyledNumberInput = styled.div`
	display: flex;
	width: fit-content;
	flex: 1;
	flex-direction: column;
	max-width: 300px;
	width: 100%;
	align-items: flex-end;
`
