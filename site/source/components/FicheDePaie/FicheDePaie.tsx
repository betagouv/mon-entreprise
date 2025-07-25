import './FicheDePaie.css'

import { styled } from 'styled-components'

import { Cotisations } from './Cotisations'
import Line from './Line'
import SalaireBrut from './SalaireBrut'
import SalaireNet from './SalaireNet'

export default function FicheDePaie() {
	return (
		<StyledContainer className="payslip__container">
			<section className="payslip__salarySection">
				<ul>
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
				</ul>
			</section>

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
