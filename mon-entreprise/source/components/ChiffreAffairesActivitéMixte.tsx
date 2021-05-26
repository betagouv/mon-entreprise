import { batchUpdateSituation } from 'Actions/actions'
import { DottedName } from 'modele-social'
import { serializeEvaluation } from 'publicodes'
import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { situationSelector } from 'Selectors/simulationSelectors'
import { Explicable } from './conversation/Explicable'
import { Condition } from './EngineValue'
import { SimulationGoal } from './SimulationGoals'
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
		<>
			<SimulationGoal
				appear={false}
				onUpdateSituation={clearChiffreAffaireMixte}
				dottedName={dottedName}
			/>
			<ActivitéMixte />

			<Condition expression="entreprise . activité . mixte">
				<li className="small-target">
					<ul>
						{Object.values(proportions).map((chiffreAffaires) => (
							<SimulationGoal
								key={chiffreAffaires}
								onUpdateSituation={adjustProportions}
								dottedName={chiffreAffaires}
							/>
						))}
					</ul>
				</li>
			</Condition>
		</>
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
		<li
			className="small-target"
			css={`
				margin-top: -1rem;
			`}
		>
			<label
				css={`
					display: flex;
					align-items: center;
					justify-content: flex-end;
				`}
			>
				<input
					type="checkbox"
					key={'' + defaultChecked}
					defaultChecked={defaultChecked}
					onChange={(evt) => onMixteChecked(evt.target.checked)}
				/>
				&nbsp; Activité mixte
				<Explicable>
					<Markdown source={`## ${rule.title}\n ${rule.rawNode.description}`} />
				</Explicable>
			</label>
		</li>
	)
}
