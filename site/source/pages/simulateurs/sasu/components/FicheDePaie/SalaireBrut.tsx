import { useTranslation } from 'react-i18next'

import { Condition } from '@/components/EngineValue/Condition'
import { H3 } from '@/design-system'

import '@/components/FicheDePaie/FicheDePaie.css'

import { Line } from '@/components/FicheDePaie/Line'

export const SalaireBrut = () => {
	const { t } = useTranslation()

	return (
		<section className="payslip__salarySection">
			<H3 className="payslip__salaryTitle">{t('Salaire brut')}</H3>
			<ul>
				<Line rule="assimilé salarié . rémunération . salaire brut" />
				<Line rule="assimilé salarié . rémunération . avantages en nature . montant" />
				<Condition expression="assimilé salarié . rémunération . avantages en nature . montant">
					<Line rule="assimilé salarié . rémunération . brute" />
				</Condition>
			</ul>
		</section>
	)
}
