import { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

import RéductionBasique from '@/components/RéductionDeCotisations/RéductionBasique'
import RéductionMoisParMois from '@/components/RéductionDeCotisations/RéductionMoisParMois'
import { SimulationGoals } from '@/components/Simulation'
import { useEngine } from '@/components/utils/EngineContext'
import useYear from '@/components/utils/useYear'
import { situationSelector } from '@/store/selectors/simulationSelectors'
import {
	getDataAfterOptionsChange,
	getDataAfterRémunérationChange,
	getDataAfterSituationChange,
	getInitialRéductionMoisParMois,
	MonthState,
	Options,
	réductionGénéraleDottedName,
	RégularisationMethod,
	rémunérationBruteDottedName,
	SituationType,
} from '@/utils/réductionDeCotisations'

import Warnings from './components/Warnings'
import WarningSalaireTrans from './components/WarningSalaireTrans'

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
	const [réductionGénéraleMoisParMoisData, setData] = useState<MonthState[]>([])
	const year = useYear()
	const situation = useSelector(situationSelector) as SituationType
	const previousSituation = useRef(situation)
	const { t } = useTranslation()

	const initializeRéductionGénéraleMoisParMoisData = useCallback(() => {
		const data = getInitialRéductionMoisParMois(
			réductionGénéraleDottedName,
			year,
			engine
		)
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

	useEffect(() => {
		setData((previousData) => {
			return getDataAfterSituationChange(
				réductionGénéraleDottedName,
				situation,
				previousSituation.current,
				previousData,
				year,
				régularisationMethod,
				engine
			)
		})
	}, [engine, situation, régularisationMethod, year])

	const onRémunérationChange = (
		monthIndex: number,
		rémunérationBrute: number
	) => {
		setData((previousData) => {
			return getDataAfterRémunérationChange(
				réductionGénéraleDottedName,
				monthIndex,
				rémunérationBrute,
				previousData,
				year,
				régularisationMethod,
				engine,
				dispatch
			)
		})
	}

	const onOptionsChange = (monthIndex: number, options: Options) => {
		setData((previousData) => {
			return getDataAfterOptionsChange(
				réductionGénéraleDottedName,
				monthIndex,
				options,
				previousData,
				year,
				régularisationMethod,
				engine
			)
		})
	}

	return (
		<SimulationGoals toggles={toggles} legend={legend}>
			{monthByMonth ? (
				<RéductionMoisParMois
					dottedName={réductionGénéraleDottedName}
					data={réductionGénéraleMoisParMoisData}
					onRémunérationChange={onRémunérationChange}
					onOptionsChange={onOptionsChange}
					caption={t(
						'pages.simulateurs.réduction-générale.month-by-month.caption',
						'Réduction générale mois par mois :'
					)}
					warnings={<Warnings />}
					warningCondition={`${rémunérationBruteDottedName} > 1.6 * SMIC`}
					warningTooltip={<WarningSalaireTrans />}
					codeRéduction={t(`code {{ code }}`, {
						code: '671',
					})}
					codeRégularisation={t(`code {{ code }}`, {
						code: '801',
					})}
				/>
			) : (
				<RéductionBasique
					dottedName={réductionGénéraleDottedName}
					onUpdate={initializeRéductionGénéraleMoisParMoisData}
					warnings={<Warnings />}
					warningCondition={`${rémunérationBruteDottedName} > 1.6 * SMIC`}
					warningMessage={<WarningSalaireTrans />}
				/>
			)}
		</SimulationGoals>
	)
}
