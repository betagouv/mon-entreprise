import { useTranslation } from 'react-i18next'

import StackedRulesChart from '@/components/simulationExplanation/StackedRulesChart/StackedRulesChart'
import { H2 } from '@/design-system'

export default function RépartitionRevenu() {
	const { t } = useTranslation()

	return (
		<section>
			<H2>
				{t(
					'pages.simulateurs.auto-entrepreneur.explications.répartition.h2',
					'Répartition du chiffre d’affaires'
				)}
			</H2>
			<StackedRulesChart
				data={{
					revenu: {
						dottedName: 'dirigeant . rémunération . net . après impôt',
						title: t(
							'pages.simulateurs.auto-entrepreneur.explications.répartition.revenu',
							'Revenu (incluant les dépenses liées à l’activité)'
						),
					},
					cotisations: {
						dottedName:
							'dirigeant . auto-entrepreneur . cotisations et contributions',
						title: t(
							'pages.simulateurs.auto-entrepreneur.explications.répartition.cotisations',
							'Cotisations'
						),
					},
					impôt: {
						dottedName: 'impôt . montant',
						title: t(
							'pages.simulateurs.auto-entrepreneur.explications.répartition.impôt',
							'Impôt'
						),
					},
				}}
			/>
		</section>
	)
}
