import { DottedName } from 'modele-social'
import { PublicodesExpression, serializeEvaluation } from 'publicodes'
import { useCallback } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { styled } from 'styled-components'

import { Switch } from '@/design-system/switch'
import { useLazyPromise } from '@/hooks/usePromise'
import { batchUpdateSituation } from '@/store/actions/actions'
import { situationSelector } from '@/store/selectors/simulationSelectors'
import { ReplaceReturnType } from '@/types/utils'
import { catchDivideByZeroError } from '@/utils'
import {
	useAsyncGetRule,
	usePromiseOnSituationChange,
	useWorkerEngine,
} from '@/worker/socialWorkerEngineClient'

import { ExplicableRule } from './conversation/Explicable'
import { Condition, WhenApplicable } from './EngineValue'
import { SimulationGoal } from './Simulation'
import { FromTop } from './ui/animate'

const proportions = {
	'entreprise . activités . revenus mixtes . proportions . service BIC':
		"entreprise . chiffre d'affaires . service BIC",
	'entreprise . activités . revenus mixtes . proportions . service BNC':
		"entreprise . chiffre d'affaires . service BNC",
	'entreprise . activités . revenus mixtes . proportions . vente restauration hébergement':
		"entreprise . chiffre d'affaires . vente restauration hébergement",
} as const

export default function ChiffreAffairesActivitéMixte({
	dottedName,
}: {
	dottedName: DottedName
}) {
	const adjustProportions = useAdjustProportions(dottedName)
	const dispatch = useDispatch()
	const { t } = useTranslation()
	const clearChiffreAffaireMixte = useCallback(() => {
		dispatch(
			batchUpdateSituation(
				Object.values(proportions).reduce(
					(acc, chiffreAffaires) => ({ ...acc, [chiffreAffaires]: undefined }),
					{}
				)
			)
		)
	}, [dispatch])

	return (
		<fieldset>
			<legend className="sr-only">{t("Chiffre d'affaires")}</legend>
			<SimulationGoal
				appear={false}
				onUpdateSituation={clearChiffreAffaireMixte}
				dottedName={dottedName}
			/>
			<WhenApplicable dottedName="entreprise . activités . revenus mixtes">
				<FromTop>
					<ActivitéMixte />
					<Condition expression="entreprise . activités . revenus mixtes">
						{Object.values(proportions).map((chiffreAffaires) => (
							<SimulationGoal
								small
								key={chiffreAffaires}
								onUpdateSituation={
									adjustProportions as ReplaceReturnType<
										ReturnType<typeof useAdjustProportions>,
										void
									>
								}
								dottedName={chiffreAffaires}
							/>
						))}
					</Condition>
				</FromTop>
			</WhenApplicable>
		</fieldset>
	)
}

function useAdjustProportions(CADottedName: DottedName) {
	const dispatch = useDispatch()
	const workerEngine = useWorkerEngine()

	const [, trigger] = useLazyPromise(
		async (name: DottedName, value?: PublicodesExpression) => {
			const checkValue = (
				val: unknown
			): val is { valeur: number; unité: string } =>
				val != null &&
				typeof val === 'object' &&
				'valeur' in val &&
				'unité' in val &&
				typeof val.valeur === 'number' &&
				typeof val.unité === 'string'

			const old = await Promise.all(
				Object.values(proportions).map(async (chiffreAffaire) =>
					serializeEvaluation(
						await workerEngine.asyncEvaluate(
							name === chiffreAffaire && checkValue(value)
								? value
								: chiffreAffaire
						)
					)
				)
			)
			const nouveauCA = serializeEvaluation(
				await workerEngine.asyncEvaluate({
					somme: old.filter(Boolean),
				})
			)

			if (nouveauCA === '0€/an') {
				return // Avoid division by 0
			}

			const entries = Object.entries(proportions).map(
				async ([proportionName, valueName]) => {
					const newValue = serializeEvaluation(
						await workerEngine.asyncEvaluate(
							valueName === name && checkValue(value)
								? value
								: { valeur: valueName, 'par défaut': '0€/an' }
						)
					)
					const newProportion = serializeEvaluation(
						await catchDivideByZeroError(() =>
							workerEngine.asyncEvaluate({
								valeur: `${newValue ?? ''} / ${nouveauCA ?? ''}`,
								unité: '%',
							})
						)
					)

					return [proportionName, valueName, newProportion] as const
				}
			)

			const situation = (await Promise.all(entries)).reduce(
				(acc, [proportionName, valueName, newProportion]) => ({
					...acc,
					[proportionName]: newProportion,
					[valueName]: undefined,
				}),
				{ [CADottedName]: nouveauCA }
			)
			dispatch(batchUpdateSituation(situation))
		},
		[CADottedName, dispatch, workerEngine]
	)

	return trigger
}

function ActivitéMixte() {
	const dispatch = useDispatch()
	const situation = useSelector(situationSelector)
	const rule = useAsyncGetRule('entreprise . activités . revenus mixtes')
	const workerEngine = useWorkerEngine()
	const defaultChecked =
		usePromiseOnSituationChange(
			() =>
				workerEngine.asyncEvaluate('entreprise . activités . revenus mixtes'),
			[workerEngine]
		)?.nodeValue === true

	const onMixteChecked = useCallback(
		(checked: boolean) => {
			dispatch(
				batchUpdateSituation(
					Object.values(proportions).reduce(
						(acc, dottedName) => ({ ...acc, [dottedName]: undefined }),
						{
							'entreprise . activités . revenus mixtes': checked
								? 'oui'
								: 'non',
						}
					)
				)
			)
		},
		[dispatch, situation]
	)

	return (
		<div key={Boolean(defaultChecked).toString()}>
			<StyledActivitéMixteContainer>
				<Trans>
					<Switch
						size="XS"
						defaultSelected={defaultChecked}
						onChange={onMixteChecked}
						light
					>
						Activité mixte
					</Switch>
				</Trans>
				{rule && <ExplicableRule dottedName={rule.dottedName} light />}
			</StyledActivitéMixteContainer>
		</div>
	)
}

const StyledActivitéMixteContainer = styled.div`
	display: flex;
	align-items: center;
	justify-content: flex-end;

	@media (min-width: ${({ theme }) => theme.breakpointsWidth.sm}) {
		text-align: right;
		margin-top: -1.5rem;
		position: relative;
		z-index: 2;
		display: flex;
		align-items: center;
	}
`
