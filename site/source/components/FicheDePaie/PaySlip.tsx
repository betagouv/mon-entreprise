import './PaySlip.css'

import { styled } from 'styled-components'

import { Cotisations } from './Cotisations'
import Line from './Line'
import SalaireBrut from './SalaireBrut'
import SalaireNet from './SalaireNet'

export default function PaySlip() {
	return (
		<StyledContainer className="payslip__container">
			<div className="payslip__salarySection">
				<Line
					rule="salarié . temps de travail"
					displayedUnit="heures/mois"
					precision={1}
				/>
				<Line
					rule="salarié . temps de travail . heures supplémentaires"
					displayedUnit="heures/mois"
					precision={1}
				/>
			</div>

			<SalaireBrut />
			<Cotisations />
			<SalaireNet />
		</StyledContainer>
	)
}

const StyledContainer = styled.div`
	line-height: 1.5rem;

	.value {
		display: flex;
		align-items: flex-end;
		justify-content: flex-end;
		padding-right: 0.2em;
	}
`
