import { useTranslation } from 'react-i18next'

import { Condition } from '@/components/EngineValue/Condition'
import { Line } from '@/components/simulationExplanation/FicheDePaie/Line'
import { H3 } from '@/design-system'

import '@/components/simulationExplanation/FicheDePaie/FicheDePaie.css'

export const SalaireBrut = () => {
	const { t } = useTranslation()

	return (
		<section className="payslip__salarySection">
			<H3 className="payslip__salaryTitle">{t('Salaire brut')}</H3>
			<ul>
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
			</ul>
		</section>
	)
}
