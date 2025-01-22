import { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

import { WhenApplicable } from '@/components/EngineValue/WhenApplicable'
import RéductionBasique from '@/components/RéductionDeCotisations/RéductionBasique'
import RéductionMoisParMois from '@/components/RéductionDeCotisations/RéductionMoisParMois'
import { SimulationGoals } from '@/components/Simulation'
import { useEngine } from '@/components/utils/EngineContext'
import useYear from '@/components/utils/useYear'
import { Message } from '@/design-system'
import { Body } from '@/design-system/typography/paragraphs'
import { useBarèmeLodeom } from '@/hooks/useBarèmeLodeom'
import { useZoneLodeom } from '@/hooks/useZoneLodeom'
import {
	situationSelector,
	targetUnitSelector,
} from '@/store/selectors/simulationSelectors'
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
	toggles,
	legend,
	régularisationMethod,
}: {
	toggles?: React.ReactNode
	legend: string
	régularisationMethod?: RégularisationMethod
}) {
	const engine = useEngine()
	const dispatch = useDispatch()
	const [lodeomMoisParMoisData, setData] = useState<MonthState[]>([])
	const year = useYear()
	const situation = useSelector(situationSelector) as SituationType
	const previousSituation = useRef(situation)
	const currentZone = useZoneLodeom()
	const currentBarème = useBarèmeLodeom()
	const { t } = useTranslation()

	const currentUnit = useSelector(targetUnitSelector)
	const monthByMonth = currentUnit === '€'

	const codeRéduction = engine.evaluate(
		'salarié . cotisations . exonérations . lodeom . code réduction'
	).nodeValue as string
	const codeRégularisation = engine.evaluate(
		'salarié . cotisations . exonérations . lodeom . code régularisation'
	).nodeValue as string

	const withRépartition = currentZone === 'zone un'

	const initializeLodeomMoisParMoisData = useCallback(() => {
		const data = getInitialRéductionMoisParMois(
			lodeomDottedName,
			year,
			engine,
			withRépartition
		)
		setData(data)
	}, [engine, withRépartition, year])

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
				engine,
				régularisationMethod,
				withRépartition
			)
		})
	}, [engine, situation, régularisationMethod, year, withRépartition])

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
				engine,
				dispatch,
				régularisationMethod,
				withRépartition
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
				engine,
				régularisationMethod,
				withRépartition
			)
		})
	}

	return (
		<SimulationGoals toggles={toggles} legend={legend}>
			<Warnings />
			<WhenApplicable dottedName="salarié . cotisations . exonérations . zones lodeom">
				{!currentBarème && (
					<Message type="info">
						<Body>
							{t(
								'pages.simulateurs.lodeom.warnings.barème',
								'Veuillez sélectionner une localisation et un barème pour accéder au simulateur.'
							)}
						</Body>
					</Message>
				)}
			</WhenApplicable>
			{currentBarème &&
				(monthByMonth ? (
					<RéductionMoisParMois
						dottedName={lodeomDottedName}
						data={lodeomMoisParMoisData}
						onRémunérationChange={onRémunérationChange}
						onOptionsChange={onOptionsChange}
						caption={t(
							'pages.simulateurs.lodeom.month-by-month.caption',
							'Exonération Lodeom mois par mois :'
						)}
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
						withRépartitionAndRégularisation={withRépartition}
					/>
				) : (
					<RéductionBasique
						dottedName={lodeomDottedName}
						onUpdate={initializeLodeomMoisParMoisData}
						warningCondition={`${lodeomDottedName} = 0`}
						warningMessage={<WarningSalaireTrans />}
						withRépartition={withRépartition}
					/>
				))}
		</SimulationGoals>
	)
}
