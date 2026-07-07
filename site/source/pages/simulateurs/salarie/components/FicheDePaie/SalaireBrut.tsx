import { useTranslation } from 'react-i18next'

import { Condition } from '@/components/EngineValue/Condition'
import { Line } from '@/components/simulationExplanation/FicheDePaie/Line'
import { SectionSalaireBrut } from '@/components/simulationExplanation/FicheDePaie/SectionSalaireBrut'
import { Spacing } from '@/design-system/index'

export const SalaireBrut = () => {
	const { t } = useTranslation()

	return (
		<SectionSalaireBrut>
			<Line rule="salarie . contrat . salaire brut" />
			<Line rule="salarie . rémunération . heures supplémentaires" />
			<Line rule="salarie . rémunération . heures complémentaires" />
			<Line rule="salarie . rémunération . primes" />
			<Line rule="salarie . rémunération . indemnités CDD" />
			<Line rule="salarie . rémunération . avantages en nature . montant" />
			<Line
				rule="salarie . rémunération . frais professionnels . non déductible"
				title={t(
					'components.fiche-de-paie.salaire-brut.frais-pro',
					'Frais professionnels non déductibles'
				)}
			/>
			<Line rule="salarie . activité partielle . retrait absence" />
			<Line rule="salarie . activité partielle . indemnités" />
			<Condition expression="salarie . contrat . salaire brut != salarie . rémunération . brut">
				<Spacing md />
				<Line rule="salarie . rémunération . brut" />
			</Condition>
		</SectionSalaireBrut>
	)
}
