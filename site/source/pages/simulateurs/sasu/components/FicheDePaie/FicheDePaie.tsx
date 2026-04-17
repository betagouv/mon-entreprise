import { FicheDePaie as FicheDePaieContainer } from '@/components/simulationExplanation/FicheDePaie/FicheDePaie'

import { Cotisations } from './Cotisations'
import { SalaireBrut } from './SalaireBrut'
import { SalaireNet } from './SalaireNet'

export const FicheDePaie = () => (
	<FicheDePaieContainer>
		<SalaireBrut />
		<Cotisations />
		<SalaireNet />
	</FicheDePaieContainer>
)
