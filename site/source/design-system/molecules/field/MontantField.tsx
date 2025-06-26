import { styled } from 'styled-components'

import { montant, Montant, UnitéMonétaire } from '@/domaine/Montant'
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
`
