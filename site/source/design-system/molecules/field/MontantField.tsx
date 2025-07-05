import { styled } from 'styled-components'

import { montant, Montant } from '@/domaine/Montant'
import { UnitéMonétaire } from '@/domaine/Unités'
import { useSelection } from '@/hooks/UseSelection'
import { NoOp } from '@/utils/NoOp'

import { NumericInput } from '../../atoms/NumericInput'

interface MontantFieldProps<U extends UnitéMonétaire> {
	value: Montant<U> | undefined
	unité: U
	onChange?: (value: Montant<U> | undefined) => void
	onSubmit?: (source?: string) => void
	placeholder?: Montant<U>
	suggestions?: Record<string, Montant<U>>
	small?: boolean
	avecCentimes?: boolean

	id?: string
	label?: React.ReactNode
	aria?: {
		labelledby?: string
		label?: string
	}
}

const unitéToDisplayedUnit: Record<UnitéMonétaire, string> = {
	'€': '',
	'€/an': 'par an',
	'€/mois': 'par mois',
	'€/jour': 'par jour',
	'€/heure': 'par heure',
}

export const MontantField = <U extends UnitéMonétaire>({
	value,
	unité,
	onChange = NoOp,
	onSubmit,
	placeholder,
	suggestions,
	avecCentimes = false,
	small,
	id,
	label,
	aria,
}: MontantFieldProps<U>) => {
	const { handleChange, currentSelection: currentValue } = useSelection({
		value,
		onChange,
	})

	const handleValueChange = (valeur: number | undefined) => {
		handleChange(valeur === undefined ? undefined : montant<U>(valeur, unité))
	}

	const displayedUnit = unitéToDisplayedUnit[unité] ?? unité

	return (
		<Container>
			<NumericInput
				id={id}
				label={label}
				aria-label={label ? '' : aria?.label}
				aria-labelledby={label ? '' : aria?.labelledby}
				onChange={handleValueChange}
				onSubmit={onSubmit}
				formatOptions={{
					style: 'currency',
					currency: 'EUR',
					minimumFractionDigits: 0,
					maximumFractionDigits: avecCentimes ? 2 : 0,
				}}
				placeholder={placeholder?.valeur}
				value={currentValue?.valeur}
				unit={displayedUnit}
				small={small}
				suggestions={
					suggestions
						? Object.fromEntries(
								Object.entries(suggestions).map(([key, montant]) => [
									key,
									montant.valeur,
								])
						  )
						: undefined
				}
			/>
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
	/* Ajuster le padding de l'input à l'intérieur */
	input {
		padding-right: 0 !important;
	}
`
