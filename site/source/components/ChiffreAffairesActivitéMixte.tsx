import { DottedName } from 'modele-social'
import { PublicodesExpression, serializeEvaluation } from 'publicodes'
import { useCallback } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'

import { batchUpdateSituation } from '@/actions/actions'
import { Switch } from '@/design-system/switch'
import { situationSelector } from '@/selectors/simulationSelectors'
import { catchDivideByZeroError } from '@/utils'

import { Condition } from './EngineValue'
import { SimulationGoal } from './Simulation'
import { ExplicableRule } from './conversation/Explicable'
import { useEngine } from './utils/EngineContext'

const proportions = {
	'entreprise . activité . mixte . proportions . service BIC':
		"entreprise . chiffre d'affaires . service BIC",
	'entreprise . activité . mixte . proportions . service BNC':
		"entreprise . chiffre d'affaires . service BNC",
	'entreprise . activité . mixte . proportions . vente restauration hébergement':
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
			<ActivitéMixte />

			<Condition expression="entreprise . activité . mixte">
				{Object.values(proportions).map((chiffreAffaires) => (
					<SimulationGoal
						small
						key={chiffreAffaires}
						onUpdateSituation={adjustProportions}
						dottedName={chiffreAffaires}
					/>
				))}
			</Condition>
		</fieldset>
	)
}

function useAdjustProportions(CADottedName: DottedName) {
	const engine = useEngine()
	const dispatch = useDispatch()

	return useCallback(
		(name: DottedName, value?: PublicodesExpression) => {
			const checkValue = (
				val: unknown
			): val is { valeur: number; unité: string } =>
				val != null &&
				typeof val === 'object' &&
				'valeur' in val &&
				'unité' in val &&
				typeof val.valeur === 'number' &&
				typeof val.unité === 'string'

			const old = Object.values(proportions).map((chiffreAffaire) =>
				serializeEvaluation(
					engine.evaluate(
						name === chiffreAffaire && checkValue(value)
							? value
							: chiffreAffaire
					)
				)
			)
			const nouveauCA = serializeEvaluation(
				engine.evaluate({ somme: old.filter(Boolean) })
			)

			if (nouveauCA === '0€/an') {
				return // Avoid division by 0
			}
			const situation = Object.entries(proportions).reduce(
				(acc, [proportionName, valueName]) => {
					const newValue = serializeEvaluation(
						engine.evaluate(
							valueName === name && checkValue(value)
								? value
								: { valeur: valueName, 'par défaut': '0€/an' }
						)
					)
					const newProportion = serializeEvaluation(
						catchDivideByZeroError(() =>
							engine.evaluate({
								valeur: `${newValue ?? ''} / ${nouveauCA ?? ''}`,
								unité: '%',
							})
						)
					)

					return {
						...acc,
						[proportionName]: newProportion,
						[valueName]: undefined,
					}
				},
				{ [CADottedName]: nouveauCA }
			)
			dispatch(batchUpdateSituation(situation))
		},
		[CADottedName, engine, dispatch]
	)
}

function ActivitéMixte() {
	const dispatch = useDispatch()
	const situation = useSelector(situationSelector)
	const rule = useEngine().getRule('entreprise . activité . mixte')
	const defaultChecked =
		useEngine().evaluate('entreprise . activité . mixte').nodeValue === true
	const onMixteChecked = useCallback(
		(checked: boolean) => {
			dispatch(
				batchUpdateSituation(
					Object.values(proportions).reduce(
						(acc, dottedName) => ({ ...acc, [dottedName]: undefined }),
						{
							'entreprise . activité . mixte': checked ? 'oui' : 'non',
						}
					)
				)
			)
		},
		[dispatch, situation]
	)

	const { t } = useTranslation()

	return (
		<div key={Boolean(defaultChecked).toString()}>
			<StyledActivitéMixteContainer>
				<Trans>
					<Switch
						size="XS"
						defaultSelected={defaultChecked}
						onChange={onMixteChecked}
						light
						$textColor={(theme) => theme.colors.extended.grey[100]}
					>
						Activité mixte
					</Switch>
				</Trans>
				<ExplicableRule
					dottedName={rule.dottedName}
					light
					aria-label={t('En savoir plus')}
				/>
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
