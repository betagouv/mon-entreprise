import { batchUpdateSituation } from '@/actions/actions'
import { Switch } from '@/design-system/switch'
import { situationSelector } from '@/selectors/simulationSelectors'
import { DottedName } from 'modele-social'
import { serializeEvaluation } from 'publicodes'
import { useCallback } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import { ExplicableRule } from './conversation/Explicable'
import { Condition } from './EngineValue'
import { SimulationGoal } from './Simulation'
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
		<fieldset aria-label={t("Chiffre d'affaires")}>
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
export function useAdjustProportions(CADottedName: DottedName): () => void {
	const engine = useEngine()
	const dispatch = useDispatch()

	return useCallback(() => {
		const nouveauCA = serializeEvaluation(
			engine.evaluate({
				somme: Object.values(proportions)
					.map((chiffreAffaire) =>
						serializeEvaluation(engine.evaluate(chiffreAffaire))
					)
					.filter(Boolean),
			})
		)
		if (nouveauCA === '0€/an') {
			return // Avoid division by 0
		}
		const situation = Object.entries(proportions).reduce(
			(acc, [proportionName, valueName]) => {
				const value = serializeEvaluation(
					engine.evaluate({ valeur: valueName, 'par défaut': '0€/an' })
				)
				const newProportion = serializeEvaluation(
					engine.evaluate({
						valeur: `${value ?? ''} / ${nouveauCA ?? ''}`,
						unité: '%',
					})
				)

				return { ...acc, [proportionName]: newProportion }
			},
			{ [CADottedName]: nouveauCA }
		)
		dispatch(batchUpdateSituation(situation))
	}, [engine, dispatch])
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
						{ 'entreprise . activité . mixte': checked ? 'oui' : 'non' }
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
				<ExplicableRule dottedName={rule.dottedName} light />
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
