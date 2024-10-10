import { DottedName } from 'modele-social'
import { PublicodesExpression } from 'publicodes'
import { useCallback, useEffect, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { styled } from 'styled-components'

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
import { Li, Ul } from '@/design-system/typography/list'
import { Body } from '@/design-system/typography/paragraphs'
import { SimpleRuleEvaluation } from '@/domaine/engine/SimpleRuleEvaluation'
import { ajusteLaSituation } from '@/store/actions/actions'

import EffectifSwitch from './components/EffectifSwitch'
import RéductionGénéraleMensuelle from './RéductionGénéraleMensuelle'
import {
	getInitialRéductionGénéraleMensuelle,
	getRéductionGénéraleFromRémunération,
} from './utils'

export default function RéductionGénéraleSimulation() {
	return (
		<>
			<Simulation afterQuestionsSlot={<SelectSimulationYear />}>
				<SimulateurWarning simulateur="réduction-générale" />
				<RéductionGénéraleSimulationGoals />
			</Simulation>
		</>
	)
}

export type MonthState = {
	rémunérationBrute: number
	réductionGénérale: number
}

function RéductionGénéraleSimulationGoals() {
	const engine = useEngine()
	const dispatch = useDispatch()
	const { t } = useTranslation()
	// TODO: remplacer "salarié . cotisations . assiette" par "salarié . rémunération . brut"
	// lorsqu'elle n'incluera plus les frais professionnels.
	const rémunérationBruteDottedName =
		'salarié . cotisations . assiette' as DottedName
	const [monthByMonth, setMonthByMonth] = useState(false)
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

	const onEffectifSwitch = useCallback(() => {
		setData((previousData) =>
			previousData.map((item) => ({
				...item,
				réductionGénérale: getRéductionGénéraleFromRémunération(
					engine,
					item.rémunérationBrute
				),
			}))
		)
	}, [engine])

	const onPeriodSwitch = useCallback((unit: string) => {
		setMonthByMonth(unit === '€')
	}, [])

	return (
		<SimulationGoals
			toggles={
				<>
					<EffectifSwitch onSwitch={onEffectifSwitch} />
					<PeriodSwitch
						periods={[
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
						]}
						onSwitch={onPeriodSwitch}
					/>
				</>
			}
			legend={t(
				'pages.simulateurs.réduction-générale.legend',
				'Rémunération brute du salarié et réduction générale applicable'
			)}
		>
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

					<Condition expression="salarié . cotisations . exonérations . JEI = oui">
						<Message type="info">
							<Body>
								<Trans>
									La réduction générale n'est pas cumulable avec l'exonération
									Jeune Entreprise Innovante (JEI).
								</Trans>
							</Body>
						</Message>
					</Condition>

					<Condition expression="salarié . contrat = 'stage'">
						<Message type="info">
							<Body>
								<Trans>
									La réduction générale ne s'applique pas sur les gratifications
									de stage.
								</Trans>
							</Body>
						</Message>
					</Condition>

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
						<StyledUl>
							<StyledLi>
								<SimulationValue
									dottedName={
										'salarié . cotisations . exonérations . réduction générale . part retraite'
									}
									round={false}
								/>
							</StyledLi>
							<StyledLi>
								<SimulationValue
									dottedName={
										'salarié . cotisations . exonérations . réduction générale . part Urssaf'
									}
									round={false}
								/>
								<SimulationValue
									dottedName={
										'salarié . cotisations . exonérations . réduction générale . part Urssaf . part chômage'
									}
									round={false}
									label={t('dont chômage', 'dont chômage')}
								/>
							</StyledLi>
						</StyledUl>
					</Condition>
				</>
			)}
		</SimulationGoals>
	)
}

const StyledUl = styled(Ul)`
	margin-top: 0;
`
const StyledLi = styled(Li)`
	&::before {
		margin-top: ${({ theme }) => theme.spacings.sm};
	}
`
