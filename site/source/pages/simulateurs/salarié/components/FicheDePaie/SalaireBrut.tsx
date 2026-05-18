import { useTranslation } from 'react-i18next'

import { Condition } from '@/components/EngineValue/Condition'
import { Line } from '@/components/simulationExplanation/FicheDePaie/Line'
import { SectionSalaireBrut } from '@/components/simulationExplanation/FicheDePaie/SectionSalaireBrut'
import { Spacing } from '@/design-system'

export const SalaireBrut = () => {
	const { t } = useTranslation()

	return (
		<SectionSalaireBrut>
			<Line rule="salarié . contrat . salaire brut" />
			<Line rule="salarié . rémunération . heures supplémentaires" />
			<Line rule="salarié . rémunération . heures complémentaires" />
			<Line rule="salarié . rémunération . primes" />
			<Line rule="salarié . rémunération . indemnités CDD" />
			<Line rule="salarié . rémunération . avantages en nature . montant" />
			<Line
				rule="salarié . rémunération . frais professionnels . non déductible"
				title={t(
					'components.fiche-de-paie.salaire-brut.frais-pro',
					'Frais professionnels non déductibles'
				)}
			/>
			<Line rule="salarié . activité partielle . retrait absence" />
			<Line rule="salarié . activité partielle . indemnités" />
			<Condition expression="salarié . contrat . salaire brut != salarié . rémunération . brut">
				<Spacing md />
				<Line rule="salarié . rémunération . brut" />
			</Condition>
		</SectionSalaireBrut>
	)
}
