import { styled } from 'styled-components'

import { SimulationValue } from '@/components/Simulation/SimulationValue'
import { Li, Ul } from '@/design-system/typography/list'

type Props = {
	round?: boolean
}

export default function Répartition({ round = true }: Props) {
	return (
		<StyledUl>
			<StyledLi>
				<SimulationValue
					dottedName="salarié . cotisations . exonérations . réduction générale . part retraite"
					round={round}
				/>
			</StyledLi>
			<StyledLi>
				<SimulationValue
					dottedName="salarié . cotisations . exonérations . réduction générale . part Urssaf"
					round={round}
				/>
				<SimulationValue
					dottedName="salarié . cotisations . exonérations . réduction générale . part Urssaf . part chômage"
					label="dont chômage"
					round={round}
				/>
			</StyledLi>
		</StyledUl>
	)
}

const StyledUl = styled(Ul)`
	margin-top: 0;
`
const StyledLi = styled(Li)`
	&::before {
		margin-top: ${({ theme }) => theme.spacings.sm};
	}
`
