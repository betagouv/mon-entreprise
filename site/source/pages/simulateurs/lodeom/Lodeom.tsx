import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'

import EffectifSwitch from '@/components/EffectifSwitch'
import PeriodSwitch from '@/components/PeriodSwitch'
import RégularisationSwitch from '@/components/RéductionDeCotisations/RégularisationSwitch'
import { SelectSimulationYear } from '@/components/SelectSimulationYear'
import SimulateurWarning from '@/components/SimulateurWarning'
import Simulation from '@/components/Simulation'
import { useZoneLodeom } from '@/hooks/useZoneLodeom'
import { RégularisationMethod } from '@/utils/réductionDeCotisations'

import BarèmeSwitch from './components/BarèmeSwitch'
import ZoneSwitch from './components/ZoneSwitch'
import LodeomSimulationGoals from './Goals'

export default function LodeomSimulation() {
	const currentZone = useZoneLodeom()
	const [monthByMonth, setMonthByMonth] = useState(false)
	const { t } = useTranslation()
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
							<ZoneSwitch />
							<BarèmeSwitch />
							{currentZone === 'zone un' && (
								<>
									<RégularisationSwitch
										régularisationMethod={régularisationMethod}
										setRégularisationMethod={setRégularisationMethod}
									/>
									<EffectifSwitch />
								</>
							)}
							<PeriodSwitch periods={periods} onSwitch={onPeriodSwitch} />
						</>
					}
					régularisationMethod={régularisationMethod}
				/>
			</Simulation>
		</>
	)
}
