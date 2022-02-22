import { batchUpdateSituation } from '~/actions/actions'
import ButtonHelp from '~/design-system/buttons/ButtonHelp'
import { Checkbox } from '~/design-system/field'
import { DottedName } from 'modele-social'
import { serializeEvaluation } from 'publicodes'
import { useCallback } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { situationSelector } from '~/selectors/simulationSelectors'
import styled from 'styled-components'
import { Condition } from './EngineValue'
import { SimulationGoal } from './Simulation'
import { useEngine } from './utils/EngineContext'
import { Markdown } from './utils/markdown'

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
				alwaysShow
				onUpdateSituation={clearChiffreAffaireMixte}
				dottedName={dottedName}
			/>
			<ActivitéMixte />

			<Condition expression="entreprise . activité . mixte">
				{Object.values(proportions).map((chiffreAffaires) => (
					<SimulationGoal
						alwaysShow
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
						valeur: `${value} / ${nouveauCA}`,
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
		<StyledActivitéMixteContainer>
			<Trans>
				<Checkbox defaultSelected={defaultChecked} onChange={onMixteChecked}>
					Activité mixte
				</Checkbox>
			</Trans>
			<ButtonHelp type="aide" title={rule.title} light>
				<Markdown>{rule.rawNode.description ?? ''}</Markdown>
			</ButtonHelp>
		</StyledActivitéMixteContainer>
	)
}

const StyledActivitéMixteContainer = styled.div`
	@media (min-width: ${({ theme }) => theme.breakpointsWidth.sm}) {
		text-align: right;
		margin-top: -1.5rem;
		position: relative;
		z-index: 2;
	}
`
