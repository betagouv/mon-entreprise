import { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

import RéductionBasique from '@/components/RéductionDeCotisations/RéductionBasique'
import RéductionMoisParMois from '@/components/RéductionDeCotisations/RéductionMoisParMois'
import { SimulationGoals } from '@/components/Simulation'
import { useEngine } from '@/components/utils/EngineContext'
import useYear from '@/components/utils/useYear'
import { useZoneLodeom } from '@/hooks/useZoneLodeom'
import { situationSelector } from '@/store/selectors/simulationSelectors'
import {
	getDataAfterOptionsChange,
	getDataAfterRémunérationChange,
	getDataAfterSituationChange,
	getInitialRéductionMoisParMois,
	lodeomDottedName,
	MonthState,
	Options,
	RégularisationMethod,
	SituationType,
} from '@/utils/réductionDeCotisations'

import Warnings from './components/Warnings'
import WarningSalaireTrans from './components/WarningSalaireTrans'

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
	const currentZone = useZoneLodeom()
	const { t } = useTranslation()

	const codeRéduction = engine.evaluate(
		'salarié . cotisations . exonérations . lodeom . code réduction'
	).nodeValue as string
	const codeRégularisation = engine.evaluate(
		'salarié . cotisations . exonérations . lodeom . code régularisation'
	).nodeValue as string

	const initializeLodeomMoisParMoisData = useCallback(() => {
		const data = getInitialRéductionMoisParMois(lodeomDottedName, year, engine)
		setData(data)
	}, [engine, year])

	useEffect(() => {
		if (lodeomMoisParMoisData.length === 0) {
			initializeLodeomMoisParMoisData()
		}
	}, [initializeLodeomMoisParMoisData, lodeomMoisParMoisData.length])

	useEffect(() => {
		setData((previousData) => {
			return getDataAfterSituationChange(
				lodeomDottedName,
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
				lodeomDottedName,
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
				lodeomDottedName,
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
					dottedName={lodeomDottedName}
					data={lodeomMoisParMoisData}
					onRémunérationChange={onRémunérationChange}
					onOptionsChange={onOptionsChange}
					caption={t(
						'pages.simulateurs.lodeom.month-by-month.caption',
						'Exonération Lodeom mois par mois :'
					)}
					warnings={<Warnings />}
					warningCondition={`${lodeomDottedName} = 0`}
					warningTooltip={<WarningSalaireTrans />}
					codeRéduction={
						codeRéduction &&
						t(`code {{ code }}`, {
							code: codeRéduction,
						})
					}
					codeRégularisation={
						codeRégularisation &&
						t(`code {{ code }}`, {
							code: codeRégularisation,
						})
					}
					withRépartition={currentZone === 'zone un'}
				/>
			) : (
				<RéductionBasique
					dottedName={lodeomDottedName}
					onUpdate={initializeLodeomMoisParMoisData}
					warnings={<Warnings />}
					warningCondition={`${lodeomDottedName} = 0`}
					warningMessage={<WarningSalaireTrans />}
					withRépartition={currentZone === 'zone un'}
				/>
			)}
		</SimulationGoals>
	)
}
