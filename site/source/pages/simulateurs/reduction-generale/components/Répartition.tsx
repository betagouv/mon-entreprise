import { Trans } from 'react-i18next'
import { styled } from 'styled-components'

import { SimulationValue } from '@/components/Simulation/SimulationValue'
import { Strong } from '@/design-system/typography'
import { Li, Ul } from '@/design-system/typography/list'
import { Body } from '@/design-system/typography/paragraphs'
import { Contexte } from '@/domaine/Contexte'

import { réductionGénéraleDottedName } from '../utils'

type Props = {
	contexte?: Contexte
}

export default function Répartition({ contexte = {} }: Props) {
	return (
		<>
			<Body>
				<Strong>
					<Trans>Détail du montant :</Trans>
				</Strong>
			</Body>
			<StyledUl>
				<StyledLi>
					<SimulationValue
						dottedName={`${réductionGénéraleDottedName} . imputation retraite complémentaire`}
						label="IRC"
						contexte={contexte}
						round={false}
					/>
				</StyledLi>
				<StyledLi>
					<SimulationValue
						dottedName={`${réductionGénéraleDottedName} . imputation sécurité sociale`}
						label="URSSAF"
						contexte={contexte}
						round={false}
					/>
					<SimulationValue
						dottedName={`${réductionGénéraleDottedName} . imputation chômage`}
						label="dont chômage"
						contexte={contexte}
						round={false}
					/>
				</StyledLi>
			</StyledUl>
		</>
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
