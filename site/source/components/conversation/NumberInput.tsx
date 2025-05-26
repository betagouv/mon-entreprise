import { ASTNode } from 'publicodes'
import { styled } from 'styled-components'

import { NumberField } from '@/design-system/field'
import { InputSuggestions } from '@/design-system/suggestions'
import { useSelection } from '@/hooks/UseSelection'
import { NoOp } from '@/utils/NoOp'

interface NumberInputProps {
	value: number | undefined
	onChange?: (value: number | undefined) => void
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

export default function NumberInput({
	suggestions,
	onChange = NoOp,
	onSubmit,
	value,
	missing,
	formatOptions,
	showSuggestions,
	id,
	aria,
}: NumberInputProps) {
	const { handleChange, currentSelection: currentValue } = useSelection({
		value,
		onChange,
	})

	const completeFormatOptions = {
		style: 'decimal',
		...formatOptions,
	}

	const handleValueChange = (valeur: number | undefined) => {
		handleChange(valeur)
	}

	return (
		<StyledNumberInput>
			<NumberField
				id={id}
				aria-labelledby={aria?.labelledby}
				aria-label={aria?.label}
				description={''}
				onChange={handleValueChange}
				formatOptions={completeFormatOptions}
				placeholder={missing && value != null ? value : undefined}
				value={currentValue}
			/>
			{showSuggestions && suggestions && (
				<InputSuggestions
					className="print-hidden"
					suggestions={suggestions}
					onFirstClick={(node: ASTNode) => {
						handleChange(node.rawNode.valeur)
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
