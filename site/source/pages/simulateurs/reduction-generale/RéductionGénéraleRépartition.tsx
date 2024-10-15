import { styled } from 'styled-components'

import { SimulationValue } from '@/components/Simulation/SimulationValue'
import { Li, Ul } from '@/design-system/typography/list'
import { Contexte } from '@/domaine/Contexte'

type Props = {
	contexte?: Contexte
	round?: boolean
}

export default function RéductionGénéraleRépartition({
	contexte = {},
	round = true,
}: Props) {
	return (
		<StyledUl>
			<StyledLi>
				<SimulationValue
					dottedName="salarié . cotisations . exonérations . réduction générale . part retraite"
					contexte={contexte}
					round={round}
				/>
			</StyledLi>
			<StyledLi>
				<SimulationValue
					dottedName="salarié . cotisations . exonérations . réduction générale . part Urssaf"
					contexte={contexte}
					round={round}
				/>
				<SimulationValue
					dottedName="salarié . cotisations . exonérations . réduction générale . part Urssaf . part chômage"
					label="dont chômage"
					contexte={contexte}
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
