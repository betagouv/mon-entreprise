import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'

import PeriodSwitch from '@/components/PeriodSwitch'
import EffectifSwitch from '@/components/RéductionDeCotisations/EffectifSwitch'
import RégularisationSwitch from '@/components/RéductionDeCotisations/RégularisationSwitch'
import { SelectSimulationYear } from '@/components/SelectSimulationYear'
import SimulateurWarning from '@/components/SimulateurWarning'
import Simulation from '@/components/Simulation'
import { RégularisationMethod } from '@/utils/réductionDeCotisations'

import CongésPayésSwitch from './components/CongésPayésSwitch'
import RéductionGénéraleSimulationGoals from './Goals'

export default function RéductionGénéraleSimulation() {
	const { t } = useTranslation()
	const [monthByMonth, setMonthByMonth] = useState(false)
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
	const onPeriodSwitch = useCallback((unit: string) => {
		setMonthByMonth(unit === '€')
	}, [])

	const [régularisationMethod, setRégularisationMethod] =
		useState<RégularisationMethod>('progressive')

	return (
		<>
			<Simulation afterQuestionsSlot={<SelectSimulationYear />}>
				<SimulateurWarning simulateur="réduction-générale" />
				<RéductionGénéraleSimulationGoals
					monthByMonth={monthByMonth}
					legend={t(
						'pages.simulateurs.réduction-générale.legend',
						'Salaire brut du salarié et réduction générale applicable'
					)}
					toggles={
						<>
							<RégularisationSwitch
								régularisationMethod={régularisationMethod}
								setRégularisationMethod={setRégularisationMethod}
							/>
							<EffectifSwitch />
							<CongésPayésSwitch />
							<PeriodSwitch periods={periods} onSwitch={onPeriodSwitch} />
						</>
					}
					régularisationMethod={régularisationMethod}
				/>
			</Simulation>
		</>
	)
}
