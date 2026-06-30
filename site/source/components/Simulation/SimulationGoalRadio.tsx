import { Key, useId } from 'react'
import { styled } from 'styled-components'

import {
	ChoiceOption,
	Grid,
	InfoBulle,
	RadioChoiceGroup,
	TitreObjectifRadio,
} from '@/design-system'

type Props = {
	titre: string | React.ReactNode
	value?: string
	options: Array<ChoiceOption>
	onChange: (value: Key) => void
	aide?: React.ReactNode
	documentation?: {
		element: React.ReactNode
		id: string
	}
}

export const SimulationGoalRadio = ({
	titre,
	value,
	options,
	onChange,
	aide,
	documentation,
}: Props) => {
	const baseId = useId()

	return (
		<GridCentered>
			<TitleGrid item>
				<TitreObjectifRadio aria-describedby={documentation?.id}>
					{titre}
					{aide && <InfoBulle description={aide} />}
				</TitreObjectifRadio>
				{documentation?.element}
			</TitleGrid>

			<Grid item>
				<RadioChoiceGroup
					id={`${baseId}-input`}
					value={value}
					onChange={onChange}
					options={options}
				/>
			</Grid>
		</GridCentered>
	)
}

const GridCentered = styled.fieldset`
	position: relative;
	z-index: 1;
	display: grid;
	grid-template-columns: 1.15fr 1fr;
	gap: ${({ theme }) => theme.spacings.md};

	& > div {
		padding: 0;
		margin-right: ${({ theme }) => theme.spacings.xxs};
	}

	@media (max-width: ${({ theme }) => theme.breakpointsWidth.sm}) {
		grid-template-columns: 1fr;
		gap: ${({ theme }) => theme.spacings.xs};
		margin-left: -${({ theme }) => theme.spacings.xs} !important;

		& > div {
			text-align: left;
		}
	}
`

const TitleGrid = styled(Grid)`
	text-align: right;
	padding-top: ${({ theme }) => theme.spacings.sm} !important;
`
