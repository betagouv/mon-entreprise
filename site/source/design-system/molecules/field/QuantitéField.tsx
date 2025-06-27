import { styled } from 'styled-components'

import { quantité, Quantité, UnitéQuantité } from '@/domaine/Quantité'
import { useSelection } from '@/hooks/UseSelection'
import { NoOp } from '@/utils/NoOp'

import { NumericInput } from '../../atoms/NumericInput'
import { FieldWithUnit } from './FieldWithUnit'

interface QuantitéFieldProps<U extends string> {
	value: Quantité<U> | undefined
	unité: U
	onChange?: (value: Quantité<U> | undefined) => void
	onSubmit?: (source?: string) => void
	placeholder?: Quantité<U>
	suggestions?: Record<string, Quantité<U>>
	small?: boolean
	nbDécimalesMax?: number

	id?: string
	label?: React.ReactNode
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

export const QuantitéField = <U extends string>({
	value,
	unité,
	onChange = NoOp,
	onSubmit,
	placeholder,
	suggestions,
	small,
	nbDécimalesMax,
	id,
	label,
	aria,
}: QuantitéFieldProps<U>) => {
	const isPercentage = unité === '%'

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
		const valeurFinale = isPercentage ? valeur * 100 : valeur
		handleChange(quantité<U>(valeurFinale, unité))
	}

	const formatOptions = (
		isPercentage
			? {
					style: 'percent',
					maximumFractionDigits: 2,
			  }
			: nbDécimalesMax !== undefined
			? {
					style: 'decimal',
					maximumFractionDigits: nbDécimalesMax,
			  }
			: {
					style: 'decimal',
			  }
	) satisfies Intl.NumberFormatOptions

	// Pour les pourcentages, le format 'percent' multiplie par 100,
	// donc nous devons diviser notre valeur stockée en % par 100
	const displayValue =
		isPercentage && currentValue?.valeur !== undefined
			? currentValue.valeur / 100
			: currentValue?.valeur

	const displayPlaceholder =
		isPercentage && placeholder?.valeur !== undefined
			? placeholder.valeur / 100
			: placeholder?.valeur

	const displayedUnit = !isPercentage
		? unitéToDisplayedUnit[unité as UnitéQuantité] ?? unité
		: undefined

	return (
		<Container>
			<FieldWithUnit unit={displayedUnit} small={small}>
				<NumericInput
					id={id}
					label={label}
					aria-label={label ? '' : aria?.label}
					aria-labelledby={label ? '' : aria?.labelledby}
					onChange={handleValueChange}
					onSubmit={onSubmit}
					formatOptions={formatOptions}
					placeholder={displayPlaceholder}
					value={displayValue}
					small={small}
					suggestions={
						suggestions
							? Object.fromEntries(
									Object.entries(suggestions).map(([key, quantité]) => [
										key,
										isPercentage ? quantité.valeur / 100 : quantité.valeur,
									])
							  )
							: undefined
					}
				/>
			</FieldWithUnit>
		</Container>
	)
}

const Container = styled.div`
	display: flex;
	width: fit-content;
	flex: 1;
	flex-direction: column;
	max-width: 300px;
	width: 100%;
	align-items: flex-end;
`
