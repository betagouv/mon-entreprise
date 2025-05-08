import { ASTNode } from 'publicodes'
import { styled } from 'styled-components'

import { NumberField } from '@/design-system/field'
import {
	montant,
	Montant,
	UnitéMonétaire,
	unitéMonétaireToString,
} from '@/domaine/Montant'
import { useSelection } from '@/hooks/UseSelection'
import { NoOp } from '@/utils/NoOp'

import InputSuggestions from './InputSuggestions'

interface MontantInputProps<U extends UnitéMonétaire> {
	value: Montant<U> | undefined
	unité: U
	onChange?: (value: Montant | undefined) => void
	missing?: boolean
	onSubmit?: (source?: string) => void
	suggestions?: Record<string, ASTNode>
	showSuggestions?: boolean

	id?: string
	description?: string
	formatOptions?: Intl.NumberFormatOptions

	aria?: {
		labelledby?: string
		label?: string
	}
}

export default function MontantInput<U extends UnitéMonétaire>({
	value,
	unité,
	suggestions,
	onChange = NoOp,
	onSubmit,
	missing,
	formatOptions,
	showSuggestions,
	id,
	aria,
}: MontantInputProps<U>) {
	const { handleChange, currentSelection: currentValue } = useSelection({
		value,
		onChange,
	})

	const completeFormatOptions = {
		style: 'currency',
		currency: 'EUR',
		minimumFractionDigits: 0,
		...formatOptions,
	}

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
				displayedUnit={unitéMonétaireToString(unité)}
				onChange={handleValueChange}
				formatOptions={completeFormatOptions}
				placeholder={missing && value != null ? value.valeur : undefined}
				value={currentValue?.valeur}
			/>
			{showSuggestions && suggestions && (
				<InputSuggestions
					className="print-hidden"
					suggestions={suggestions}
					onFirstClick={(node: ASTNode) => {
						handleChange(montant(node.rawNode.valeur as number, unité))
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
