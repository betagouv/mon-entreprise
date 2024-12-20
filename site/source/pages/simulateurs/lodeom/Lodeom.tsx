import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'

import PeriodSwitch from '@/components/PeriodSwitch'
import RégularisationSwitch from '@/components/RégularisationSwitch'
import { SelectSimulationYear } from '@/components/SelectSimulationYear'
import SimulateurWarning from '@/components/SimulateurWarning'
import Simulation from '@/components/Simulation'

import LodeomSimulationGoals from './Goals'
import { RégularisationMethod } from './utils'

export default function LodeomSimulation() {
	const { t } = useTranslation()
	const [monthByMonth, setMonthByMonth] = useState(false)
	const periods = [
		{
			label: t('pages.simulateurs.lodeom.tab.month', 'Exonération mensuelle'),
			unit: '€/mois',
		},
		{
			label: t('pages.simulateurs.lodeom.tab.year', 'Exonération annuelle'),
			unit: '€/an',
		},
		{
			label: t(
				'pages.simulateurs.lodeom.tab.month-by-month',
				'Exonération mois par mois'
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
				<SimulateurWarning simulateur="lodeom" />
				<LodeomSimulationGoals
					monthByMonth={monthByMonth}
					legend={t(
						'pages.simulateurs.lodeom.legend',
						'Rémunération brute du salarié et exonération Lodeom applicable'
					)}
					toggles={
						<>
							<RégularisationSwitch
								régularisationMethod={régularisationMethod}
								setRégularisationMethod={setRégularisationMethod}
							/>
							<PeriodSwitch periods={periods} onSwitch={onPeriodSwitch} />
						</>
					}
					régularisationMethod={régularisationMethod}
				/>
			</Simulation>
		</>
	)
}
