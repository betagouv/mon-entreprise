import { updateSituation } from 'Actions/actions'
import Conversation from 'Components/conversation/Conversation'
import { Condition } from 'Components/EngineValue'
import SearchButton from 'Components/SearchButton'
import SimulateurWarning from 'Components/SimulateurWarning'
import { SimulationGoal, SimulationGoals } from 'Components/SimulationGoals'
import StackedBarChart from 'Components/StackedBarChart'
import { ThemeColorsContext } from 'Components/utils/colors'
import { useEngine } from 'Components/utils/EngineContext'
import { default as React, useContext } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import AidesCovid from '../../components/simulationExplanation/AidesCovid'

export default function AutoEntrepreneur() {
	return (
		<>
			<SimulateurWarning simulateur="auto-entrepreneur" />
			<SearchButton invisibleButton />

			<SimulationGoals className="plain">
				<Condition expression="entreprise . activité . mixte = non">
					<SimulationGoal
						appear={false}
						labelWithTitle
						dottedName="dirigeant . auto-entrepreneur . chiffre d'affaires"
					/>
					<ActivitéMixte />
				</Condition>
				<Condition expression="entreprise . activité . mixte">
					<SimulationGoal
						appear={false}
						editable={false}
						labelWithTitle
						dottedName="entreprise . chiffre d'affaires"
					/>
					<ActivitéMixte />
					<li>
						<ul>
							<SimulationGoal
								small
								labelWithTitle
								dottedName="entreprise . chiffre d'affaires . vente restauration hébergement"
							/>
							<SimulationGoal
								labelWithTitle
								small
								dottedName="entreprise . chiffre d'affaires . prestations de service . BIC"
							/>
							<SimulationGoal
								labelWithTitle
								small
								dottedName="entreprise . chiffre d'affaires . prestations de service . BNC"
							/>
						</ul>
					</li>
				</Condition>

				<SimulationGoal
					labelWithTitle
					dottedName="dirigeant . auto-entrepreneur . net de cotisations"
				/>
				<SimulationGoal
					labelWithTitle
					dottedName="dirigeant . auto-entrepreneur . net après impôt"
				/>
			</SimulationGoals>
			<Conversation />
			<Explanation />
		</>
	)
}

function ActivitéMixte() {
	const defaultCheked = !!useEngine().evaluate('entreprise . activité . mixte')
		.nodeValue
	const dispatch = useDispatch()

	return (
		<li
			className="ui__ notice small-target"
			css={`
				margin-top: -0.4rem;
			`}
		>
			<label
				css={`
					display: flex;
					align-items: center;
				`}
			>
				Activité mixte&nbsp;{' '}
				<input
					type="checkbox"
					defaultChecked={defaultCheked}
					onChange={(evt) =>
						setTimeout(() =>
							dispatch(
								updateSituation(
									'entreprise . activité . mixte',
									evt.target.checked ? 'oui' : 'non'
								)
							)
						)
					}
				/>{' '}
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
