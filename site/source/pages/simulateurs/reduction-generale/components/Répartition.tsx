import { styled } from 'styled-components'

import { SimulationValue } from '@/components/Simulation/SimulationValue'
import { Li, Ul } from '@/design-system/typography/list'

export default function Répartition() {
	return (
		<StyledUl>
			<StyledLi>
				<SimulationValue
					dottedName="salarié . cotisations . exonérations . réduction générale . part retraite"
					round={false}
				/>
			</StyledLi>
			<StyledLi>
				<SimulationValue
					dottedName="salarié . cotisations . exonérations . réduction générale . part Urssaf"
					round={false}
				/>
				<SimulationValue
					dottedName="salarié . cotisations . exonérations . réduction générale . part Urssaf . part chômage"
					label="dont chômage"
					round={false}
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
