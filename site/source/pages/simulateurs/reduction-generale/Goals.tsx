import { DottedName } from 'modele-social'
import { PublicodesExpression } from 'publicodes'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

import { Condition } from '@/components/EngineValue/Condition'
import { SimulationGoal, SimulationGoals } from '@/components/Simulation'
import { SimulationValue } from '@/components/Simulation/SimulationValue'
import { useEngine } from '@/components/utils/EngineContext'
import useYear from '@/components/utils/useYear'
import { Message } from '@/design-system'
import { Spacing } from '@/design-system/layout'
import { Body } from '@/design-system/typography/paragraphs'
import { SimpleRuleEvaluation } from '@/domaine/engine/SimpleRuleEvaluation'
import { Situation } from '@/domaine/Situation'
import { ajusteLaSituation } from '@/store/actions/actions'
import { situationSelector } from '@/store/selectors/simulationSelectors'

import Répartition from './components/Répartition'
import Warnings from './components/Warnings'
import WarningSalaireTrans from './components/WarningSalaireTrans'
import RéductionGénéraleMoisParMois from './MoisParMois'
import {
	getInitialRéductionGénéraleMoisParMois,
	heuresComplémentairesDottedName,
	heuresSupplémentairesDottedName,
	MonthState,
	Options,
	réductionGénéraleDottedName,
	reevaluateRéductionGénéraleMoisParMois,
	RégularisationMethod,
	rémunérationBruteDottedName,
} from './utils'

type SituationType = Situation & {
	[heuresSupplémentairesDottedName]?: {
		explanation: {
			nodeValue: number
		}
	}
	[heuresComplémentairesDottedName]?: {
		explanation: {
			nodeValue: number
		}
	}
}

export default function RéductionGénéraleSimulationGoals({
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
	const situation = useSelector(situationSelector) as SituationType
	const previousSituation = useRef(situation)

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
		réductionGénéraleMoisParMoisData.length,
	])

	const getOptionsFromSituations = (
		previousSituation: SituationType,
		newSituation: SituationType
	): Partial<Options> => {
		const options = {} as Partial<Options>

		const previousHeuresSupplémentaires =
			previousSituation[heuresSupplémentairesDottedName]?.explanation.nodeValue
		const newHeuresSupplémentaires =
			newSituation[heuresSupplémentairesDottedName]?.explanation.nodeValue
		if (newHeuresSupplémentaires !== previousHeuresSupplémentaires) {
			options.heuresSupplémentaires = newHeuresSupplémentaires || 0
		}

		const previousHeuresComplémentaires =
			previousSituation[heuresComplémentairesDottedName]?.explanation.nodeValue
		const newHeuresComplémentaires =
			newSituation[heuresComplémentairesDottedName]?.explanation.nodeValue
		if (newHeuresComplémentaires !== previousHeuresComplémentaires) {
			options.heuresComplémentaires = newHeuresComplémentaires || 0
		}

		return options
	}

	useEffect(() => {
		setData((previousData) => {
			if (!Object.keys(situation).length) {
				return getInitialRéductionGénéraleMoisParMois(year, engine)
			}

			const newOptions = getOptionsFromSituations(
				previousSituation.current,
				situation
			)

			const updatedData = previousData.map((data) => {
				return {
					...data,
					options: {
						...data.options,
						...newOptions,
					},
				}
			}, [])

			return reevaluateRéductionGénéraleMoisParMois(
				updatedData,
				engine,
				year,
				régularisationMethod
			)
		})

		previousSituation.current = situation
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

	const onOptionsChange = (monthIndex: number, options: Options) => {
		setData((previousData) => {
			const updatedData = [...previousData]
			updatedData[monthIndex] = {
				...updatedData[monthIndex],
				options,
			}

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
					onRémunérationChange={onRémunérationChange}
					onOptionsChange={onOptionsChange}
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
