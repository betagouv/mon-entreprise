import { Key, useId } from 'react'
import { styled } from 'styled-components'

import {
	ChoiceOption,
	Grid,
	InfoBulle,
	RadioChoiceGroup,
	TitreObjectifSaisissable,
} from '@/design-system'

type Props = {
	titre: string | React.ReactNode
	value?: string
	options: Array<ChoiceOption>
	onChange: (value: Key) => void
	aide?: React.ReactNode
}

export const SimulationGoalRadio = ({
	titre,
	value,
	options,
	onChange,
	aide,
}: Props) => {
	const baseId = useId()

	return (
		<GridCentered>
			<TitleGrid item>
				<TitreObjectifSaisissable
					htmlFor={`${baseId}-input`}
					id={`${baseId}-label`}
				>
					{titre}
				</TitreObjectifSaisissable>
				{aide && <InfoBulle description={aide} />}
			</TitleGrid>

			<Grid item>
				<RadioChoiceGroup
					id={`${baseId}-input`}
					value={value}
					onChange={onChange}
					aria={{ labelledby: `${baseId}-label` }}
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
		/* text-align: right; */
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
