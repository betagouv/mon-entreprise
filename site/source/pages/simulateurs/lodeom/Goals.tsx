import { Option, pipe } from 'effect'
import { sumAll } from 'effect/Number'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'

import { WhenApplicable } from '@/components/EngineValue/WhenApplicable'
import { SimulationGoals } from '@/components/Simulation'
import { Body, Message } from '@/design-system'
import { ValeurPublicodes } from '@/domaine/engine/PublicodesAdapter'
import { QuantitéAdapter } from '@/domaine/engine/QuantitéAdapter'
import { eurosParAn } from '@/domaine/MontantRecurrent'
import { DottedName } from '@/domaine/publicodes/DottedName'
import { quantitéToNumber } from '@/domaine/Quantite'
import { useBarèmeLodeom } from '@/hooks/useBarèmeLodeom'
import useYear from '@/hooks/useYear'
import { useZoneLodeom } from '@/hooks/useZoneLodeom'
import EffectifSwitch from '@/pages/simulateurs/lodeom/components/EffectifSwitch'
import RéductionMoisParMois from '@/pages/simulateurs/lodeom/components/RéductionMoisParMois'
import RégularisationSwitch from '@/pages/simulateurs/lodeom/components/RégularisationSwitch'
import {
	getDataAfterGlobalOptionsChange,
	getDataAfterOptionsChange,
	getDataAfterRémunérationChange,
	heuresComplémentairesDottedName,
	heuresSupplémentairesDottedName,
	initialRéductionMoisParMois,
	lodeomDottedName,
	MonthState,
	Options,
	RégularisationMethod,
	rémunérationBruteDottedName,
} from '@/pages/simulateurs/lodeom/utils'
import { ajusteLaSituation } from '@/store/actions/actions'
import { useEngine } from '@/utils/publicodes/EngineContext'

import BarèmeSwitch from './components/BarèmeSwitch'
import Warnings from './components/Warnings'
import WarningSalaireTrans from './components/WarningSalaireTrans'
import ZoneSwitch from './components/ZoneSwitch'

export default function LodeomSimulationGoals() {
	const engine = useEngine()
	const dispatch = useDispatch()
	const year = useYear()

	const currentZone = useZoneLodeom()
	const currentBarème = useBarèmeLodeom()
	const withRépartitionAndRégularisation = currentZone === 'zone un'

	const [lodeomMoisParMoisData, setData] = useState<MonthState[]>(
		initialRéductionMoisParMois
	)
	const [régularisationMethod, setRégularisationMethod] =
		useState<RégularisationMethod>('progressive')

	const { t } = useTranslation()

	const codeRéduction = engine.evaluate(
		'salarié . cotisations . exonérations . lodeom . code réduction'
	).nodeValue as string
	const codeRégularisation = engine.evaluate(
		'salarié . cotisations . exonérations . lodeom . code régularisation'
	).nodeValue as string

	const getNumberFromQuantitéPublicodes = (dottedName: DottedName) =>
		pipe(
			engine.evaluate(dottedName),
			QuantitéAdapter.decode,
			Option.map(quantitéToNumber),
			Option.getOrElse(() => 0)
		)
	const heuresSupplémentairesGlobales = getNumberFromQuantitéPublicodes(
		heuresSupplémentairesDottedName
	)
	const heuresComplémentairesGlobales = getNumberFromQuantitéPublicodes(
		heuresComplémentairesDottedName
	)

	useEffect(() => {
		setData((previousData) =>
			getDataAfterGlobalOptionsChange(
				{
					heuresSupplémentaires: heuresSupplémentairesGlobales,
					heuresComplémentaires: heuresComplémentairesGlobales,
				},
				previousData,
				year,
				engine,
				régularisationMethod,
				withRépartitionAndRégularisation
			)
		)
	}, [
		engine,
		régularisationMethod,
		year,
		withRépartitionAndRégularisation,
		heuresSupplémentairesGlobales,
		heuresComplémentairesGlobales,
	])

	const onRémunérationChange = useCallback(
		(monthIndex: number, rémunérationBrute: number) => {
			const rémunérationBruteAnnuelle =
				sumAll(
					lodeomMoisParMoisData.map((monthData, index) =>
						index === monthIndex ? 0 : monthData.rémunérationBrute
					)
				) + rémunérationBrute
			dispatch(
				ajusteLaSituation({
					[rémunérationBruteDottedName]: eurosParAn(rémunérationBruteAnnuelle),
				} as Record<DottedName, ValeurPublicodes>)
			)

			setData((previousData) =>
				getDataAfterRémunérationChange(
					monthIndex,
					rémunérationBrute,
					previousData,
					year,
					engine,
					régularisationMethod,
					withRépartitionAndRégularisation
				)
			)
		},
		[
			dispatch,
			engine,
			lodeomMoisParMoisData,
			régularisationMethod,
			withRépartitionAndRégularisation,
			year,
		]
	)

	const onOptionsChange = useCallback(
		(monthIndex: number, options: Options) => {
			setData((previousData) =>
				getDataAfterOptionsChange(
					monthIndex,
					options,
					previousData,
					year,
					engine,
					régularisationMethod,
					withRépartitionAndRégularisation
				)
			)
		},
		[engine, régularisationMethod, withRépartitionAndRégularisation, year]
	)

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
