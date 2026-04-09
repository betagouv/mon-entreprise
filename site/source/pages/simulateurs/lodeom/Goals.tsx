import { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

import { WhenApplicable } from '@/components/EngineValue/WhenApplicable'
import { SimulationGoals } from '@/components/Simulation'
import { Body, Message } from '@/design-system'
import { useBarèmeLodeom } from '@/hooks/useBarèmeLodeom'
import useYear from '@/hooks/useYear'
import { useZoneLodeom } from '@/hooks/useZoneLodeom'
import EffectifSwitch from '@/pages/simulateurs/lodeom/components/EffectifSwitch'
import RéductionMoisParMois from '@/pages/simulateurs/lodeom/components/RéductionMoisParMois'
import RégularisationSwitch from '@/pages/simulateurs/lodeom/components/RégularisationSwitch'
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
} from '@/pages/simulateurs/lodeom/lodeom'
import { situationSelector } from '@/store/selectors/simulation/situation/situation.selector'
import { useEngine } from '@/utils/publicodes/EngineContext'

import BarèmeSwitch from './components/BarèmeSwitch'
import Warnings from './components/Warnings'
import WarningSalaireTrans from './components/WarningSalaireTrans'
import ZoneSwitch from './components/ZoneSwitch'

export default function LodeomSimulationGoals() {
	const engine = useEngine()
	const dispatch = useDispatch()
	const [lodeomMoisParMoisData, setData] = useState<MonthState[]>([])
	const year = useYear()
	const situation = useSelector(situationSelector) as SituationType
	const previousSituation = useRef(situation)
	const currentZone = useZoneLodeom()
	const currentBarème = useBarèmeLodeom()
	const [régularisationMethod, setRégularisationMethod] =
		useState<RégularisationMethod>('progressive')
	const { t } = useTranslation()

	const codeRéduction = engine.evaluate(
		'salarié . cotisations . exonérations . lodeom . code réduction'
	).nodeValue as string
	const codeRégularisation = engine.evaluate(
		'salarié . cotisations . exonérations . lodeom . code régularisation'
	).nodeValue as string

	const withRépartitionAndRégularisation = currentZone === 'zone un'

	const initializeLodeomMoisParMoisData = useCallback(() => {
		const data = getInitialRéductionMoisParMois(
			year,
			engine,
			withRépartitionAndRégularisation
		)
		setData(data)
	}, [engine, withRépartitionAndRégularisation, year])

	useEffect(() => {
		if (lodeomMoisParMoisData.length === 0) {
			initializeLodeomMoisParMoisData()
		}
	}, [initializeLodeomMoisParMoisData, lodeomMoisParMoisData.length])

	useEffect(() => {
		setData((previousData) => {
			return getDataAfterSituationChange(
				situation,
				previousSituation.current,
				previousData,
				year,
				engine,
				régularisationMethod,
				withRépartitionAndRégularisation
			)
		})
	}, [
		engine,
		situation,
		régularisationMethod,
		year,
		withRépartitionAndRégularisation,
	])

	const onRémunérationChange = (
		monthIndex: number,
		rémunérationBrute: number
	) => {
		setData((previousData) => {
			return getDataAfterRémunérationChange(
				monthIndex,
				rémunérationBrute,
				previousData,
				year,
				engine,
				dispatch,
				régularisationMethod,
				withRépartitionAndRégularisation
			)
		})
	}

	const onOptionsChange = (monthIndex: number, options: Options) => {
		setData((previousData) => {
			return getDataAfterOptionsChange(
				monthIndex,
				options,
				previousData,
				year,
				engine,
				régularisationMethod,
				withRépartitionAndRégularisation
			)
		})
	}

	return (
		<SimulationGoals
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
				</>
			}
		>
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
			{currentBarème && (
				<RéductionMoisParMois
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
					withRépartitionAndRégularisation={withRépartitionAndRégularisation}
				/>
			)}
		</SimulationGoals>
	)
}
