import { useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'

import PeriodSwitch from '@/components/PeriodSwitch'
import EffectifSwitch from '@/components/RéductionDeCotisations/EffectifSwitch'
import RégularisationSwitch from '@/components/RéductionDeCotisations/RégularisationSwitch'
import SimulateurWarning from '@/components/SimulateurWarning'
import Simulation from '@/components/Simulation'
import { YearSelectionBanner } from '@/components/Simulation/YearSelectionBanner'
import { Body, Strong } from '@/design-system'
import { RégularisationMethod } from '@/utils/réductionDeCotisations'

import CongésPayésSwitch from './components/CongésPayésSwitch'
import RéductionGénéraleSimulationGoals from './Goals'

export default function RéductionGénéraleSimulation() {
	const { t } = useTranslation()
	const periods = [
		{
			label: t(
				'pages.simulateurs.réduction-générale.tab.month',
				'Réduction mensuelle'
			),
			unit: '€/mois',
		},
		{
			label: t(
				'pages.simulateurs.réduction-générale.tab.year',
				'Réduction annuelle'
			),
			unit: '€/an',
		},
		{
			label: t(
				'pages.simulateurs.réduction-générale.tab.month-by-month',
				'Réduction mois par mois'
			),
			unit: '€',
		},
	]

	const [régularisationMethod, setRégularisationMethod] =
		useState<RégularisationMethod>('progressive')

	return (
		<>
			<Simulation afterQuestionsSlot={<YearSelectionBanner />}>
				<SimulateurWarning
					simulateur="réduction-générale"
					informationsComplémentaires={
						<Body>
							<Trans i18nKey="pages.simulateurs.réduction-générale.warning">
								Ce simulateur n’intègre{' '}
								<Strong>pas toutes les règles de calcul</Strong> spécifiques
								(Entreprises de Travail Temporaire, salariés des transports
								routiers soumis à un horaire d’équivalence...). Il ne tient pas
								non plus compte des taux et/ou répartition particuliers de la
								cotisation de retraite complémentaire appliqués dans certaines
								entreprises.
							</Trans>
						</Body>
					}
				/>
				<RéductionGénéraleSimulationGoals
					toggles={
						<>
							<RégularisationSwitch
								régularisationMethod={régularisationMethod}
								setRégularisationMethod={setRégularisationMethod}
							/>
							<EffectifSwitch />
							<CongésPayésSwitch />
							<PeriodSwitch periods={periods} />
						</>
					}
					régularisationMethod={régularisationMethod}
				/>
			</Simulation>
		</>
	)
}
