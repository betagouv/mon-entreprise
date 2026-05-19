import { Condition } from '@/components/EngineValue/Condition'
import { Line } from '@/components/simulationExplanation/FicheDePaie/Line'
import { SectionSalaireBrut } from '@/components/simulationExplanation/FicheDePaie/SectionSalaireBrut'
import { Spacing } from '@/design-system'

export const SalaireBrut = () => (
	<SectionSalaireBrut>
		<Line rule="assimilé salarié . rémunération . salaire brut" />
		<Line rule="assimilé salarié . rémunération . avantages en nature . montant" />
		<Condition expression="assimilé salarié . rémunération . avantages en nature . montant">
			<Spacing md />
			<Line rule="assimilé salarié . rémunération . brute" />
		</Condition>
	</SectionSalaireBrut>
)
