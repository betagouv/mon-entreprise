import { updateSituation } from 'Actions/actions'
import { Condition } from 'Components/EngineValue'
import RuleLink from 'Components/RuleLink'
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
	const dispatch = useDispatch()

	return (
		<>
			<SimulateurWarning simulateur="auto-entrepreneur" />
			<SimulationGoals className="plain">
				<ActivitéMixte />

				<Condition expression="entreprise . activité . mixte = non">
					<SimulationGoal
						labelWithTitle
						dottedName="dirigeant . auto-entrepreneur . chiffre d'affaires"
					/>
				</Condition>
				<Condition expression="entreprise . activité . mixte">
					<h2 className="optionTitle">
						<RuleLink dottedName="entreprise . chiffre d'affaires" />
					</h2>

					<SimulationGoal
						small
						labelWithTitle
						dottedName="entreprise . chiffre d'affaires . vente restauration hébergement"
					/>
					<SimulationGoal
						labelWithTitle
						small
						titleLevel={3}
						dottedName="entreprise . chiffre d'affaires . prestations de service . BIC"
					/>
					<SimulationGoal
						labelWithTitle
						small
						dottedName="entreprise . chiffre d'affaires . prestations de service . BNC"
					/>
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
			<Explanation />
		</>
	)
}

function ActivitéMixte() {
	const defaultCheked = !!useEngine().evaluate('entreprise . activité . mixte')
		.nodeValue
	const dispatch = useDispatch()
	return (
		<label>
			Activité mixte{' '}
			<input
				type="checkbox"
				defaultChecked={defaultCheked}
				onChange={(evt) =>
					dispatch(
						updateSituation(
							'entreprise . activité . mixte',
							evt.target.checked ? 'oui' : 'non'
						)
					)
				}
			/>
		</label>
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
