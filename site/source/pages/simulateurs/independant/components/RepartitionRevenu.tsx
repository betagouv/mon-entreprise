import { useTranslation } from 'react-i18next'

import StackedRulesChart from '@/components/simulationExplanation/StackedRulesChart/StackedRulesChart'
import { H2 } from '@/design-system/index'

export default function RépartitionRevenu() {
	const { t } = useTranslation()

	return (
		<section>
			<H2>
				{t(
					'pages.simulateurs.independant.explications.répartition.titre',
					'Répartition du revenu'
				)}
			</H2>
			<StackedRulesChart
				data={{
					revenu: {
						dottedName: 'independant . rémunération . nette . après impôt',
						title: t(
							'pages.simulateurs.independant.explications.répartition.revenu',
							'Revenu disponible'
						),
					},
					cotisations: {
						dottedName: 'independant . cotisations et contributions',
						title: t(
							'pages.simulateurs.independant.explications.répartition.cotisations',
							'Cotisations'
						),
					},
					impôt: {
						dottedName: 'independant . rémunération . impôt',
						title: t(
							'pages.simulateurs.independant.explications.répartition.impôt',
							'Impôt'
						),
					},
				}}
			/>
		</section>
	)
}
