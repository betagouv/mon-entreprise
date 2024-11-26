import { DottedName } from 'modele-social'
import { PublicodesExpression } from 'publicodes'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

import { Condition } from '@/components/EngineValue/Condition'
import PeriodSwitch from '@/components/PeriodSwitch'
import { SelectSimulationYear } from '@/components/SelectSimulationYear'
import SimulateurWarning from '@/components/SimulateurWarning'
import Simulation, {
	SimulationGoal,
	SimulationGoals,
} from '@/components/Simulation'
import { SimulationValue } from '@/components/Simulation/SimulationValue'
import { useEngine } from '@/components/utils/EngineContext'
import useYear from '@/components/utils/useYear'
import { Message } from '@/design-system'
import { Spacing } from '@/design-system/layout'
import { Body } from '@/design-system/typography/paragraphs'
import { SimpleRuleEvaluation } from '@/domaine/engine/SimpleRuleEvaluation'
import { ajusteLaSituation } from '@/store/actions/actions'
import { situationSelector } from '@/store/selectors/simulationSelectors'

import EffectifSwitch from './components/EffectifSwitch'
import RégularisationSwitch from './components/RégularisationSwitch'
import Répartition from './components/Répartition'
import Warnings from './components/Warnings'
import WarningSalaireTrans from './components/WarningSalaireTrans'
import RéductionGénéraleMoisParMois from './RéductionGénéraleMoisParMois'
import {
	getInitialRéductionGénéraleMoisParMois,
	MonthState,
	réductionGénéraleDottedName,
	reevaluateRéductionGénéraleMoisParMois,
	RégularisationMethod,
	rémunérationBruteDottedName,
} from './utils'

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
							<PeriodSwitch periods={periods} onSwitch={onPeriodSwitch} />
						</>
					}
					régularisationMethod={régularisationMethod}
				/>
			</Simulation>
		</>
	)
}

function RéductionGénéraleSimulationGoals({
	monthByMonth,
	toggles,
	legend,
	régularisationMethod,
}: {
	monthByMonth: boolean
	toggles?: React.ReactNode
	legend: string
	régularisationMethod: RégularisationMethod
}) {
	const engine = useEngine()
	const dispatch = useDispatch()
	const { t } = useTranslation()
	const [réductionGénéraleMoisParMoisData, setData] = useState<MonthState[]>([])
	const year = useYear()

	const initializeRéductionGénéraleMoisParMoisData = useCallback(() => {
		const data = getInitialRéductionGénéraleMoisParMois(year, engine)
		setData(data)
	}, [engine, year])

	useEffect(() => {
		if (réductionGénéraleMoisParMoisData.length === 0) {
			initializeRéductionGénéraleMoisParMoisData()
		}
	}, [
		initializeRéductionGénéraleMoisParMoisData,
		réductionGénéraleMoisParMoisData,
	])

	const situation = useSelector(situationSelector)
	useEffect(() => {
		setData((previousData) => {
			return reevaluateRéductionGénéraleMoisParMois(
				previousData,
				engine,
				year,
				régularisationMethod
			)
		})
	}, [engine, situation, régularisationMethod, year])

	const updateRémunérationBruteAnnuelle = (data: MonthState[]): void => {
		const rémunérationBruteAnnuelle = data.reduce(
			(total: number, monthState: MonthState) =>
				total + monthState.rémunérationBrute,
			0
		)
		dispatch(
			ajusteLaSituation({
				[rémunérationBruteDottedName]: {
					valeur: rémunérationBruteAnnuelle,
					unité: '€/an',
				} as PublicodesExpression,
			} as Record<DottedName, SimpleRuleEvaluation>)
		)
	}

	const onRémunérationChange = (
		monthIndex: number,
		rémunérationBrute: number
	) => {
		setData((previousData) => {
			const updatedData = [...previousData]
			updatedData[monthIndex] = {
				...updatedData[monthIndex],
				rémunérationBrute,
			}

			updateRémunérationBruteAnnuelle(updatedData)

			return reevaluateRéductionGénéraleMoisParMois(
				updatedData,
				engine,
				year,
				régularisationMethod
			)
		})
	}

	return (
		<SimulationGoals toggles={toggles} legend={legend}>
			{monthByMonth ? (
				<RéductionGénéraleMoisParMois
					data={réductionGénéraleMoisParMoisData}
					onChange={onRémunérationChange}
				/>
			) : (
				<>
					<SimulationGoal
						dottedName={rémunérationBruteDottedName}
						round={false}
						label={t('Rémunération brute')}
						onUpdateSituation={initializeRéductionGénéraleMoisParMoisData}
					/>

					<Warnings />
					<Condition expression={`${rémunérationBruteDottedName} > 1.6 * SMIC`}>
						<Message type="info">
							<Body>
								<WarningSalaireTrans />
							</Body>
						</Message>
					</Condition>

					<Condition expression={`${réductionGénéraleDottedName} >= 0`}>
						<SimulationValue
							dottedName={réductionGénéraleDottedName}
							isInfoMode={true}
							round={false}
						/>
						<Spacing md />
						<Répartition />
					</Condition>
				</>
			)}
		</SimulationGoals>
	)
}
