import { DottedName } from 'modele-social'
import { PublicodesExpression } from 'publicodes'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { SimulationGoals } from '@/components/Simulation'
import { useEngine } from '@/components/utils/EngineContext'
import useYear from '@/components/utils/useYear'
import { SimpleRuleEvaluation } from '@/domaine/engine/SimpleRuleEvaluation'
import { Situation } from '@/domaine/Situation'
import { ajusteLaSituation } from '@/store/actions/actions'
import { situationSelector } from '@/store/selectors/simulationSelectors'

import LodeomBasique from './Basique'
import LodeomMoisParMois from './MoisParMois'
import {
	getInitialLodeomMoisParMois,
	heuresComplémentairesDottedName,
	heuresSupplémentairesDottedName,
	MonthState,
	Options,
	reevaluateLodeomMoisParMois,
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
		valeur: number
	}
}

export default function LodeomSimulationGoals({
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
	const [lodeomMoisParMoisData, setData] = useState<MonthState[]>([])
	const year = useYear()
	const situation = useSelector(situationSelector) as SituationType
	const previousSituation = useRef(situation)

	const initializeLodeomMoisParMoisData = useCallback(() => {
		const data = getInitialLodeomMoisParMois(year, engine)
		setData(data)
	}, [engine, year])

	useEffect(() => {
		if (lodeomMoisParMoisData.length === 0) {
			initializeLodeomMoisParMoisData()
		}
	}, [initializeLodeomMoisParMoisData, lodeomMoisParMoisData.length])

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
			previousSituation[heuresComplémentairesDottedName]?.valeur
		const newHeuresComplémentaires =
			newSituation[heuresComplémentairesDottedName]?.valeur
		if (newHeuresComplémentaires !== previousHeuresComplémentaires) {
			options.heuresComplémentaires = newHeuresComplémentaires || 0
		}

		return options
	}

	useEffect(() => {
		setData((previousData) => {
			if (!Object.keys(situation).length) {
				return getInitialLodeomMoisParMois(year, engine)
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

			return reevaluateLodeomMoisParMois(
				updatedData,
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

			return reevaluateLodeomMoisParMois(
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

			return reevaluateLodeomMoisParMois(
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
				<LodeomMoisParMois
					data={lodeomMoisParMoisData}
					onRémunérationChange={onRémunérationChange}
					onOptionsChange={onOptionsChange}
				/>
			) : (
				<LodeomBasique onUpdate={initializeLodeomMoisParMoisData} />
			)}
		</SimulationGoals>
	)
}
