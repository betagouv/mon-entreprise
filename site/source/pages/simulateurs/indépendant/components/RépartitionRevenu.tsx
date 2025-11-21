import { useTranslation } from 'react-i18next'

import StackedRulesChart from '@/components/simulationExplanation/StackedRulesChart/StackedRulesChart'
import { H2 } from '@/design-system'

export default function RépartitionRevenu() {
	const { t } = useTranslation()

	return (
		<section>
			<H2>
				{t(
					'pages.simulateurs.indépendant.explications.répartition.titre',
					'Répartition du revenu'
				)}
			</H2>
			<StackedRulesChart
				data={{
					revenu: {
						dottedName: 'indépendant . rémunération . nette . après impôt',
						title: t(
							'pages.simulateurs.indépendant.explications.répartition.revenu',
							'Revenu disponible'
						),
					},
					cotisations: {
						dottedName: 'indépendant . cotisations et contributions',
						title: t(
							'pages.simulateurs.indépendant.explications.répartition.cotisations',
							'Cotisations'
						),
					},
					impôt: {
						dottedName: 'indépendant . rémunération . impôt',
						title: t(
							'pages.simulateurs.indépendant.explications.répartition.impôt',
							'Impôt'
						),
					},
				}}
			/>
		</section>
	)
}
