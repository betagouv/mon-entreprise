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
import { Message } from '@/design-system'
import { Spacing } from '@/design-system/layout'
import { Body } from '@/design-system/typography/paragraphs'
import { SimpleRuleEvaluation } from '@/domaine/engine/SimpleRuleEvaluation'
import { ajusteLaSituation } from '@/store/actions/actions'
import { situationSelector } from '@/store/selectors/simulationSelectors'

import EffectifSwitch from './components/EffectifSwitch'
import Répartition from './components/Répartition'
import Warnings from './components/Warnings'
import WarningSalaireTrans from './components/WarningSalaireTrans'
import RéductionGénéraleMoisParMois from './RéductionGénéraleMoisParMois'
import {
	getInitialRéductionGénéraleMoisParMois,
	getRéductionGénéraleFromRémunération,
	MonthState,
	réductionGénéraleDottedName,
	reevaluateRéductionGénéraleMoisParMois,
	rémunérationBruteDottedName,
} from './utils'

export default function RéductionGénéraleSimulation() {
	const { t } = useTranslation()
	const [monthByMonth, setMonthByMonth] = useState(false)
	const periods = [
		{
			label: t('Réduction mensuelle'),
			unit: '€/mois',
		},
		{
			label: t('Réduction annuelle'),
			unit: '€/an',
		},
		{
			label: t('Réduction mois par mois'),
			unit: '€',
		},
	]
	const onPeriodSwitch = useCallback((unit: string) => {
		setMonthByMonth(unit === '€')
	}, [])

	return (
		<>
			<Simulation afterQuestionsSlot={<SelectSimulationYear />}>
				<SimulateurWarning simulateur="réduction-générale" />
				<RéductionGénéraleSimulationGoals
					monthByMonth={monthByMonth}
					legend="Salaire brut du salarié et réduction générale applicable"
					toggles={
						<>
							<EffectifSwitch />
							<PeriodSwitch periods={periods} onSwitch={onPeriodSwitch} />
						</>
					}
				/>
			</Simulation>
		</>
	)
}

function RéductionGénéraleSimulationGoals({
	monthByMonth,
	toggles = (
		<>
			<EffectifSwitch />
			<PeriodSwitch />
		</>
	),
	legend,
}: {
	monthByMonth: boolean
	toggles?: React.ReactNode
	legend: string
}) {
	const engine = useEngine()
	const dispatch = useDispatch()
	const { t } = useTranslation()
	const [réductionGénéraleMoisParMoisData, setData] = useState<MonthState[]>([])

	const initializeRéductionGénéraleMoisParMoisData = useCallback(() => {
		setData(getInitialRéductionGénéraleMoisParMois(engine))
	}, [engine, setData])

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
		setData((previousData) =>
			reevaluateRéductionGénéraleMoisParMois(previousData, engine)
		)
	}, [engine, situation])

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
				rémunérationBrute,
				réductionGénérale: getRéductionGénéraleFromRémunération(
					engine,
					rémunérationBrute
				),
				régularisation: 0,
			}

			updateRémunérationBruteAnnuelle(updatedData)

			return updatedData
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
						label={t('Rémunération brute', 'Rémunération brute')}
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
