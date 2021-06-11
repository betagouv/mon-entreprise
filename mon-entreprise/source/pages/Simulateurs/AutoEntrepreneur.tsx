import ChiffreAffairesActivitéMixte from 'Components/ChiffreAffairesActivitéMixte'
import { WhenAlreadyDefined } from 'Components/EngineValue'
import PeriodSwitch from 'Components/PeriodSwitch'
import SimulateurWarning from 'Components/SimulateurWarning'
import Simulation from 'Components/Simulation'
import { SimulationGoal, SimulationGoals } from 'Components/SimulationGoals'
import StackedBarChart from 'Components/StackedBarChart'
import { ThemeColorsContext } from 'Components/utils/colors'
import { default as React, useContext, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'

export default function AutoEntrepreneur() {
	const [animationDisabled, setAnimationDisabled] = useState(false);
	return (
		<>
			<SimulateurWarning simulateur="auto-entrepreneur" />
			<Simulation userWillExport={() => {setAnimationDisabled(true)}}
									disableAnimation={animationDisabled}
									explanations={<Explanation disableAnimation={animationDisabled} />}>
				<PeriodSwitch />
				<SimulationGoals className="plain">
					<ChiffreAffairesActivitéMixte dottedName="dirigeant . auto-entrepreneur . chiffre d'affaires" />
					<SimulationGoal
						small
						editable={false}
						dottedName="dirigeant . auto-entrepreneur . cotisations et contributions"
					/>
					<SimulationGoal dottedName="dirigeant . auto-entrepreneur . net de cotisations" />
					<WhenAlreadyDefined dottedName="entreprise . chiffre d'affaires">
						<SimulationGoal
							small
							editable={false}
							dottedName="dirigeant . rémunération . impôt"
						/>
					</WhenAlreadyDefined>
					<SimulationGoal dottedName="dirigeant . auto-entrepreneur . net après impôt" />
				</SimulationGoals>
			</Simulation>
		</>
	)
}
interface ExplanationProps{
	disableAnimation: boolean
}

function Explanation({disableAnimation}: ExplanationProps) {
	const { t } = useTranslation()
	const { palettes } = useContext(ThemeColorsContext)
	return (
		<section>
			<h2>
				<Trans>Répartition du chiffre d'affaires</Trans>
			</h2>
			<StackedBarChart disableAnimation={disableAnimation}
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
