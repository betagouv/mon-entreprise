import '@/components/simulationExplanation/FicheDePaie/FicheDePaie.css'

import { Condition } from '@/components/EngineValue/Condition'
import { Line } from '@/components/simulationExplanation/FicheDePaie/Line'
import { SectionSalaireBrut } from '@/components/simulationExplanation/FicheDePaie/SectionSalaireBrut'

export const SalaireBrut = () => (
	<SectionSalaireBrut>
		<Line rule="salarié . contrat . salaire brut" />
		<Line rule="salarié . rémunération . heures supplémentaires" />
		<Line rule="salarié . rémunération . heures complémentaires" />
		<Line rule="salarié . rémunération . primes" />
		<Line rule="salarié . rémunération . indemnités CDD" />
		<Line rule="salarié . rémunération . avantages en nature . montant" />
		<Line rule="salarié . rémunération . frais professionnels" />
		<Line rule="salarié . activité partielle . retrait absence" />
		<Line rule="salarié . activité partielle . indemnités" />
		<Condition expression="salarié . contrat . salaire brut != salarié . rémunération . brut">
			<Line rule="salarié . rémunération . brut" />
		</Condition>
	</SectionSalaireBrut>
)
