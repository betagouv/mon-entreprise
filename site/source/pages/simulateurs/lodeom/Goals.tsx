import { Option, pipe } from 'effect'
import { sumAll } from 'effect/Number'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { styled } from 'styled-components'

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
import {
	useZoneLodeom,
	zoneAvecRépartitionEtRégularisation,
} from '@/hooks/useZoneLodeom'
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
import { situationSelector } from '@/store/selectors/simulation/situation/situation.selector'
import { useEngine } from '@/utils/publicodes/EngineContext'

import BarèmeSwitch from './components/BarèmeSwitch'
import Warnings from './components/Warnings'
import WarningSalaireTrans from './components/WarningSalaireTrans'
import ZoneSwitch from './components/ZoneSwitch'

export default function LodeomSimulationGoals() {
	const engine = useEngine()
	const dispatch = useDispatch()
	const year = useYear()
	const situation = useSelector(situationSelector)

	const currentZone = useZoneLodeom()
	const currentBarème = useBarèmeLodeom()
	const withRépartitionAndRégularisation =
		zoneAvecRépartitionEtRégularisation(currentZone)

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

	const heuresSupplémentairesGlobales =
		situation[heuresSupplémentairesDottedName]
	const heuresComplémentairesGlobales =
		situation[heuresComplémentairesDottedName]
	const globalOptions = useMemo(() => {
		const getNumberFromQuantitéPublicodes = (dottedName: DottedName) =>
			pipe(
				engine.evaluate(dottedName),
				QuantitéAdapter.decode,
				Option.map(quantitéToNumber),
				Option.getOrElse(() => 0)
			)

		return {
			heuresSupplémentaires: getNumberFromQuantitéPublicodes(
				heuresSupplémentairesDottedName
			),
			heuresComplémentaires: getNumberFromQuantitéPublicodes(
				heuresComplémentairesDottedName
			),
		} satisfies Partial<Options>
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [heuresSupplémentairesGlobales, heuresComplémentairesGlobales])

	useEffect(() => {
		setData((previousData) =>
			getDataAfterGlobalOptionsChange(
				globalOptions,
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
		globalOptions,
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
				<GoalsContainer>
					<ZoneSwitch />
					<BarèmeSwitch />
					{withRépartitionAndRégularisation && (
						<>
							<RégularisationSwitch
								régularisationMethod={régularisationMethod}
								setRégularisationMethod={setRégularisationMethod}
							/>
							<EffectifSwitch />
						</>
					)}
				</GoalsContainer>
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

const GoalsContainer = styled.div`
	display: flex;
	flex-direction: column;
	gap: ${({ theme }) => theme.spacings.xl};
	margin-bottom: ${({ theme }) => theme.spacings.xl};
`
