import ChiffreAffairesActivitéMixte from 'Components/ChiffreAffairesActivitéMixte'
import { WhenAlreadyDefined } from 'Components/EngineValue'
import PeriodSwitch from 'Components/PeriodSwitch'
import SimulateurWarning from 'Components/SimulateurWarning'
import Simulation from 'Components/Simulation'
import { InstitutionsPartenairesAutoEntrepreneur } from 'Components/simulationExplanation/InstitutionsPartenaires'
import { SimulationGoal, SimulationGoals } from 'Components/SimulationGoals'
import StackedBarChart from 'Components/StackedBarChart'
import { ThemeColorsContext } from 'Components/utils/colors'
import { H2 } from 'DesignSystem/typography/heading'
import { useContext } from 'react'
import { Trans, useTranslation } from 'react-i18next'

export default function AutoEntrepreneur() {
	return (
		<>
			<SimulateurWarning simulateur="auto-entrepreneur" />
			<Simulation explanations={<Explanation />}>
				<SimulationGoals
					toggles={<PeriodSwitch />}
					legend="Vos revenus d'auto-entrepreneur"
				>
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
function Explanation() {
	const { t } = useTranslation()
	const { palettes } = useContext(ThemeColorsContext)
	return (
		<section>
			<H2>
				<Trans>Répartition du chiffre d'affaires</Trans>
			</H2>
			<StackedBarChart
				data={[
					{
						dottedName: 'dirigeant . auto-entrepreneur . net après impôt',
						title: t("Revenu (incluant les dépenses liées à l'activité)"),
						color: palettes[0][0],
					},
					{
						dottedName: 'impôt . montant',
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
			<InstitutionsPartenairesAutoEntrepreneur />
		</section>
	)
}
