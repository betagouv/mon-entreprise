import { Option, pipe } from 'effect'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { styled } from 'styled-components'

import { WhenApplicable } from '@/components/EngineValue/WhenApplicable'
import { SimulationGoals } from '@/components/Simulation'
import { Lodeom } from '@/contextes/salarié'
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
	ajusteLaSituation,
	supprimeLaRègleDeLaSituation,
} from '@/store/actions/actions'
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

	const [lodeomMoisParMoisData, setData] = useState<Lodeom.MonthState[]>(
		Lodeom.initialRéductionMoisParMois
	)
	const [régularisationMethod, setRégularisationMethod] =
		useState<Lodeom.RégularisationMethod>('progressive')

	const paramètresDeCalcul: Lodeom.ParamètresDeCalcul = useMemo(
		() => ({
			année: year,
			moteur: engine,
			régularisation: withRépartitionAndRégularisation
				? régularisationMethod
				: 'sans',
		}),
		[year, engine, régularisationMethod, withRépartitionAndRégularisation]
	)

	const { t } = useTranslation()

	const codeRéduction = engine.evaluate(
		'salarié . cotisations . exonérations . lodeom . code réduction'
	).nodeValue as string
	const codeRégularisation = engine.evaluate(
		'salarié . cotisations . exonérations . lodeom . code régularisation'
	).nodeValue as string

	useEffect(() => {
		setData(Lodeom.initialRéductionMoisParMois)
		dispatch(supprimeLaRègleDeLaSituation(Lodeom.rémunérationBruteDottedName))
	}, [currentZone, dispatch])

	const getNumberFromQuantitéPublicodes = (dottedName: DottedName) =>
		pipe(
			engine.evaluate(dottedName),
			QuantitéAdapter.decode,
			Option.map(quantitéToNumber),
			Option.getOrElse(() => 0)
		)
	const heuresSupplémentairesGlobales = getNumberFromQuantitéPublicodes(
		Lodeom.heuresSupplémentairesDottedName
	)
	const heuresComplémentairesGlobales = getNumberFromQuantitéPublicodes(
		Lodeom.heuresComplémentairesDottedName
	)

	useEffect(() => {
		setData((previousData) =>
			Lodeom.getDataAfterSituationChange(previousData, paramètresDeCalcul)
		)
	}, [paramètresDeCalcul, situation])

	useEffect(() => {
		setData((previousData) =>
			Lodeom.getDataAfterGlobalOptionsChange(
				{
					heuresSupplémentaires: heuresSupplémentairesGlobales,
					heuresComplémentaires: heuresComplémentairesGlobales,
				},
				previousData,
				paramètresDeCalcul
			)
		)
		// Seules les heures supplémentaires/complémentaires globales doivent réétaler
		// les options sur les douze mois : les autres dépendances du calcul sont gérées
		// par le useEffect ci-dessus, qui ne touche pas aux options saisies mois par mois.
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [heuresSupplémentairesGlobales, heuresComplémentairesGlobales])

	const onRémunérationChange = useCallback(
		(monthIndex: number, rémunérationBrute: number) => {
			const brutAnnuel =
				Lodeom.rémunérationBruteAnnuelle(lodeomMoisParMoisData) -
				lodeomMoisParMoisData[monthIndex].rémunérationBrute +
				rémunérationBrute

			dispatch(
				ajusteLaSituation({
					[Lodeom.rémunérationBruteDottedName]: eurosParAn(brutAnnuel),
				} as Record<DottedName, ValeurPublicodes>)
			)

			setData((previousData) =>
				Lodeom.getDataAfterRémunérationChange(
					monthIndex,
					rémunérationBrute,
					previousData,
					paramètresDeCalcul
				)
			)
		},
		[dispatch, lodeomMoisParMoisData, paramètresDeCalcul]
	)

	const onOptionsChange = useCallback(
		(monthIndex: number, options: Lodeom.Options) => {
			setData((previousData) =>
				Lodeom.getDataAfterOptionsChange(
					monthIndex,
					options,
					previousData,
					paramètresDeCalcul
				)
			)
		},
		[paramètresDeCalcul]
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
					warningCondition={`${Lodeom.lodeomDottedName} = 0`}
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
