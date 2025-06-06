import { styled } from 'styled-components'

import { quantité, Quantité, UnitéQuantité } from '@/domaine/Quantité'
import { useSelection } from '@/hooks/UseSelection'
import { NoOp } from '@/utils/NoOp'

import { NumericInput } from '../../atoms/NumericInput'
import { InputSuggestionsRecord } from '../../suggestions/InputSuggestions'
import { FieldWithUnit } from './FieldWithUnit'

interface QuantitéFieldProps<U extends string = string> {
	value: Quantité<U> | undefined
	unité: U
	onChange?: (value: Quantité<U> | undefined) => void
	placeholder?: Quantité<U>
	onSubmit?: (source?: string) => void
	suggestions?: Record<string, Quantité<U>>
	small?: boolean

	id?: string
	description?: string

	aria?: {
		labelledby?: string
		label?: string
	}
}

const unitéToDisplayedUnit: Record<UnitéQuantité, string> = {
	'%': '%',
	'heures/mois': 'heures/mois',
	jours: 'jours',
	'jours ouvrés': 'jours ouvrés',
	mois: 'mois',
	'trimestre civil': 'trimestres',
	'année civile': 'années',
	employés: 'employés',
}

export const QuantitéField = <U extends string = string>({
	value,
	unité,
	suggestions,
	onChange = NoOp,
	onSubmit,
	placeholder,
	small,
	id,
	aria,
}: QuantitéFieldProps<U>) => {
	const { handleChange, currentSelection: currentValue } = useSelection({
		value,
		onChange,
	})

	const handleValueChange = (valeur: number | undefined) => {
		if (valeur === undefined) {
			handleChange(undefined)

			return
		}

		// Pour les pourcentages, la valeur saisie est en décimal (0.5 pour 50%)
		// mais nous stockons en pourcentage (50 pour 50%)
		const valeurFinale = unité === '%' ? valeur * 100 : valeur
		handleChange(quantité<U>(valeurFinale, unité))
	}

	const formatOptions =
		unité === '%'
			? {
					style: 'percent',
					maximumFractionDigits: 2,
			  }
			: {
					style: 'decimal',
					maximumFractionDigits: 0,
			  }

	// Pour les pourcentages, le format 'percent' multiplie par 100,
	// donc nous devons diviser notre valeur stockée en % par 100
	const displayValue =
		unité === '%' && currentValue?.valeur !== undefined
			? currentValue.valeur / 100
			: currentValue?.valeur

	const displayPlaceholder =
		unité === '%' && placeholder?.valeur !== undefined
			? placeholder.valeur / 100
			: placeholder?.valeur

	const displayedUnit =
		unité !== '%'
			? unitéToDisplayedUnit[unité as UnitéQuantité] ?? unité
			: undefined

	return (
		<StyledQuantitéField>
			<FieldWithUnit unit={displayedUnit} small={small}>
				<NumericInput
					id={id}
					aria-labelledby={aria?.labelledby}
					aria-label={aria?.label}
					description={''}
					onChange={handleValueChange}
					onSubmit={onSubmit}
					formatOptions={formatOptions}
					placeholder={displayPlaceholder}
					value={displayValue}
					small={small}
					suggestions={
						suggestions
							? (Object.fromEntries(
									Object.entries(suggestions).map(([key, quantité]) => [
										key,
										unité === '%' ? quantité.valeur / 100 : quantité.valeur,
									])
							  ) as InputSuggestionsRecord<number>)
							: undefined
					}
				/>
			</FieldWithUnit>
		</StyledQuantitéField>
	)
}

const StyledQuantitéField = styled.div`
	display: flex;
	width: fit-content;
	flex: 1;
	flex-direction: column;
	max-width: 300px;
	width: 100%;
	align-items: flex-end;
`
