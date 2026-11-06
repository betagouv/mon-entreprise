import { FicheDePaie as FicheDePaieContainer } from '@/components/simulationExplanation/FicheDePaie/FicheDePaie'

import { Cotisations } from './Cotisations'
import { SalaireBrut } from './SalaireBrut'
import { SalaireNet } from './SalaireNet'
import { TempsDeTravail } from './TempsDeTravail'

export const FicheDePaie = () => (
	<FicheDePaieContainer>
		<TempsDeTravail />
		<SalaireBrut />
		<Cotisations />
		<SalaireNet />
	</FicheDePaieContainer>
)
