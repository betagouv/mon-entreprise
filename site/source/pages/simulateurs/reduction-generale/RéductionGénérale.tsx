import { DottedName } from 'modele-social'
import { PublicodesExpression } from 'publicodes'
import { useCallback, useEffect, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
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
import RéductionGénéraleMoisParMois from './RéductionGénéraleMoisParMois'
import {
	getInitialRéductionGénéraleMoisParMois,
	getRéductionGénéraleFromRémunération,
	MonthState,
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

					<Condition expression="salarié . cotisations . exonérations . JEI = oui">
						<Message type="info">
							<Body>
								<Trans>
									La réduction générale n'est pas cumulable avec l'exonération
									Jeune Entreprise Innovante (JEI).
								</Trans>
							</Body>
						</Message>
					</Condition>

					<Condition expression="salarié . contrat = 'stage'">
						<Message type="info">
							<Body>
								<Trans>
									La réduction générale ne s'applique pas sur les gratifications
									de stage.
								</Trans>
							</Body>
						</Message>
					</Condition>

					<Condition expression="salarié . cotisations . exonérations . réduction générale = 0">
						<Message type="info">
							<Body>
								<Trans>
									La RGCP concerne uniquement les salaires inférieurs à 1,6
									SMIC. C'est-à-dire, pour 2024, une rémunération totale qui ne
									dépasse pas <strong>2 827,07 €</strong> bruts par mois.
								</Trans>
							</Body>
						</Message>
					</Condition>

					<Condition expression="salarié . cotisations . exonérations . réduction générale >= 0">
						<SimulationValue
							dottedName="salarié . cotisations . exonérations . réduction générale"
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
