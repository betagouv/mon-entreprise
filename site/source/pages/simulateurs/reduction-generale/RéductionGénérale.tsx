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
import Warnings from './components/Warnings'
import RéductionGénéraleMensuelle from './RéductionGénéraleMensuelle'
import {
	getInitialRéductionGénéraleMensuelle,
	getRéductionGénéraleFromRémunération,
	reevaluateRéductionGénéraleMensuelle,
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

export type MonthState = {
	rémunérationBrute: number
	réductionGénérale: number
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
	// TODO: remplacer "salarié . cotisations . assiette" par "salarié . rémunération . brut"
	// lorsqu'elle n'incluera plus les frais professionnels.
	const rémunérationBruteDottedName =
		'salarié . cotisations . assiette' as DottedName
	const [réductionGénéraleMensuelleData, setData] = useState<MonthState[]>([])

	const initializeRéductionGénéraleMensuelleData = useCallback(() => {
		const initialData = getInitialRéductionGénéraleMensuelle(engine)
		setData(initialData)
	}, [engine, setData])

	useEffect(() => {
		if (réductionGénéraleMensuelleData.length === 0) {
			initializeRéductionGénéraleMensuelleData()
		}
	}, [initializeRéductionGénéraleMensuelleData, réductionGénéraleMensuelleData])

	const situation = useSelector(situationSelector)
	useEffect(() => {
		setData((previousData) =>
			reevaluateRéductionGénéraleMensuelle(previousData, engine)
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
				<RéductionGénéraleMensuelle
					data={réductionGénéraleMensuelleData}
					onChange={onRémunérationChange}
				/>
			) : (
				<>
					{/* TODO: remplacer "salarié . cotisations . assiette" par "salarié . rémunération . brut"
					lorsqu'elle n'incluera plus les frais professionnels. */}
					<SimulationGoal
						dottedName="salarié . cotisations . assiette"
						round={false}
						label={t('Rémunération brute', 'Rémunération brute')}
						onUpdateSituation={initializeRéductionGénéraleMensuelleData}
					/>

					<Warnings />

					<Condition expression="salarié . cotisations . assiette > 1.6 * SMIC">
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
