import '@/components/simulationExplanation/FicheDePaie/FicheDePaie.css'

import { styled } from 'styled-components'

import { Cotisations } from './Cotisations'
import { SalaireBrut } from './SalaireBrut'
import { SalaireNet } from './SalaireNet'
import { TempsDeTravail } from './TempsDeTravail'

export const FicheDePaie = () => (
	<StyledContainer className="payslip__container">
		<TempsDeTravail />
		<SalaireBrut />
		<Cotisations />
		<SalaireNet />
	</StyledContainer>
)

const StyledContainer = styled.div`
	line-height: 1.5rem;

	.value {
		display: flex;
		align-items: flex-end;
		justify-content: flex-end;
		padding-right: 0.2em;
	}
`
