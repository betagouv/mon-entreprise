import { useTranslation } from 'react-i18next'

import { Condition } from '@/components/EngineValue/Condition'
import StackedRulesChart from '@/components/simulationExplanation/StackedRulesChart/StackedRulesChart'
import { H2 } from '@/design-system'

export const Explications = () => {
	const { t } = useTranslation()

	return (
		<Condition expression="bénéficiaire . dividendes . bruts > 0">
			<section id="simulateur-dividendes-section-total">
				<div
					style={{
						display: 'flex',
						alignItems: 'baseline',
					}}
				>
					<H2>{t('payslip.repartition', 'Répartition du total chargé')}</H2>
				</div>
				<StackedRulesChart
					data={{
						revenu: {
							dottedName: "bénéficiaire . dividendes . nets d'impôt",
							title: t(
								'pages.simulateurs.dividendes.répartition.revenu',
								'Dividendes nets'
							),
						},
						cotisations: {
							dottedName:
								'bénéficiaire . dividendes . cotisations et contributions',
							title: t(
								'pages.simulateurs.dividendes.répartition.cotisations',
								'Cotisations'
							),
						},
						impôt: {
							dottedName:
								'impôt . dividendes . montant en sus des autres revenus imposables',
							title: t(
								'pages.simulateurs.dividendes.répartition.impôt',
								'Impôt'
							),
						},
					}}
				/>
			</section>
		</Condition>
	)
}
