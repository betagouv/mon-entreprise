import { batchUpdateSituation } from 'Actions/actions'
import { Explicable } from 'Components/conversation/Explicable'
import { Condition } from 'Components/EngineValue'
import PeriodSwitch from 'Components/PeriodSwitch'
import SimulateurWarning from 'Components/SimulateurWarning'
import Simulation from 'Components/Simulation'
import { SimulationGoal, SimulationGoals } from 'Components/SimulationGoals'
import StackedBarChart from 'Components/StackedBarChart'
import { ThemeColorsContext } from 'Components/utils/colors'
import { useEngine } from 'Components/utils/EngineContext'
import { Markdown } from 'Components/utils/markdown'
import { serializeEvaluation } from 'publicodes'
import { default as React, useCallback, useContext } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { situationSelector } from 'Selectors/simulationSelectors'
import AidesCovid from '../../components/simulationExplanation/AidesCovid'

const proportions = {
	'entreprise . activité . mixte . proportions . prestations de service BIC':
		"entreprise . chiffre d'affaires . prestations de service . BIC",
	'entreprise . activité . mixte . proportions . prestations de service BNC':
		"entreprise . chiffre d'affaires . prestations de service . BNC",
	'entreprise . activité . mixte . proportions . vente restauration hébergement':
		"entreprise . chiffre d'affaires . vente restauration hébergement",
} as const
function useAdjustProportions(): () => void {
	const engine = useEngine()
	const dispatch = useDispatch()

	return useCallback(() => {
		const nouveauCA = serializeEvaluation(
			engine.evaluate({
				somme: Object.values(proportions)
					.map((name) => serializeEvaluation(engine.evaluate(name)))
					.filter(Boolean),
			})
		)
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
			{ "entreprise . chiffre d'affaires": nouveauCA }
		)
		dispatch(batchUpdateSituation(situation))
	}, [engine, dispatch])
}

export default function AutoEntrepreneur() {
	const adjustProportions = useAdjustProportions()
	const activitéMixte =
		useEngine().evaluate('entreprise . activité . mixte').nodeValue === true

	return (
		<>
			<SimulateurWarning simulateur="auto-entrepreneur" />
			<Simulation explanations={<Explanation />}>
				<PeriodSwitch />
				<SimulationGoals className="plain">
					<SimulationGoal
						appear={false}
						editable={!activitéMixte}
						dottedName="entreprise . chiffre d'affaires"
					/>

					<Condition expression="entreprise . activité . mixte">
						<li className="small-target">
							<ul>
								<SimulationGoal
									onUpdateSituation={adjustProportions}
									dottedName="entreprise . chiffre d'affaires . vente restauration hébergement"
								/>
								<SimulationGoal
									onUpdateSituation={adjustProportions}
									dottedName="entreprise . chiffre d'affaires . prestations de service . BIC"
								/>
								<SimulationGoal
									onUpdateSituation={adjustProportions}
									dottedName="entreprise . chiffre d'affaires . prestations de service . BNC"
								/>
							</ul>
						</li>
					</Condition>
					<ActivitéMixte
						key={'' + activitéMixte}
						defaultChecked={activitéMixte}
					/>
					<SimulationGoal
						small
						editable={false}
						dottedName="dirigeant . auto-entrepreneur . cotisations et contributions"
					/>
					<SimulationGoal dottedName="dirigeant . auto-entrepreneur . net de cotisations" />
					<Condition expression="impôt > 0">
						<SimulationGoal small editable={false} dottedName="impôt" />
					</Condition>
					<SimulationGoal dottedName="dirigeant . auto-entrepreneur . net après impôt" />
				</SimulationGoals>
			</Simulation>
		</>
	)
}

function ActivitéMixte({ defaultChecked }: { defaultChecked: boolean }) {
	const dispatch = useDispatch()
	const situation = useSelector(situationSelector)
	const rule = useEngine().getRule('entreprise . activité . mixte')

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

function Explanation() {
	const { t } = useTranslation()
	const { palettes } = useContext(ThemeColorsContext)
	return (
		<section>
			<AidesCovid />
			<br />
			<h2>
				<Trans>Répartition du chiffre d'affaires</Trans>
			</h2>
			<StackedBarChart
				data={[
					{
						dottedName: 'dirigeant . auto-entrepreneur . net après impôt',
						title: t("Revenu (incluant les dépenses liées à l'activité)"),
						color: palettes[0][0],
					},
					{
						dottedName: 'impôt',
						title: t('impôt'),
						color: palettes[1][0],
					},
					{
						dottedName:
							'dirigeant . auto-entrepreneur . cotisations et contributions',
						title: t('Cotisations'),
						color: palettes[1][1],
					},
				]}
			/>
		</section>
	)
}
