import { Condition } from '@/components/EngineValue/Condition'

import '@/components/simulationExplanation/FicheDePaie/FicheDePaie.css'

import { Line } from '@/components/simulationExplanation/FicheDePaie/Line'
import { SectionSalaireBrut } from '@/components/simulationExplanation/FicheDePaie/SectionSalaireBrut'

export const SalaireBrut = () => (
	<SectionSalaireBrut>
		<Line rule="assimilé salarié . rémunération . salaire brut" />
		<Line rule="assimilé salarié . rémunération . avantages en nature . montant" />
		<Condition expression="assimilé salarié . rémunération . avantages en nature . montant">
			<Line rule="assimilé salarié . rémunération . brute" />
		</Condition>
	</SectionSalaireBrut>
)
