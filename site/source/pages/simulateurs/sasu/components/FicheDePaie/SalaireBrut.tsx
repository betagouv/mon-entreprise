import { Condition } from '@/components/EngineValue/Condition'
import { Line } from '@/components/simulationExplanation/FicheDePaie/Line'
import { SectionSalaireBrut } from '@/components/simulationExplanation/FicheDePaie/SectionSalaireBrut'
import { Spacing } from '@/design-system/index'

export const SalaireBrut = () => (
	<SectionSalaireBrut>
		<Line rule="assimilé salarie . rémunération . salaire brut" />
		<Line rule="assimilé salarie . rémunération . avantages en nature . montant" />
		<Condition expression="assimilé salarie . rémunération . avantages en nature . montant">
			<Spacing md />
			<Line rule="assimilé salarie . rémunération . brute" />
		</Condition>
	</SectionSalaireBrut>
)
