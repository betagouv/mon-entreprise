import ChiffreAffairesActivitéMixte from '@/components/ChiffreAffairesActivitéMixte'
import { WhenAlreadyDefined } from '@/components/EngineValue'
import PeriodSwitch from '@/components/PeriodSwitch'
import SimulateurWarning from '@/components/SimulateurWarning'
import Simulation, {
	SimulationGoal,
	SimulationGoals,
} from '@/components/Simulation'
import { InstitutionsPartenairesAutoEntrepreneur } from '@/components/simulationExplanation/InstitutionsPartenaires'
import StackedBarChart from '@/components/StackedBarChart'
import { H2 } from '@/design-system/typography/heading'
import { useContext } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { ThemeContext } from 'styled-components'
import { SelectSimulationYear } from '@/components/SelectSimulationYear'

export default function AutoEntrepreneur() {
	return (
		<>
			<Simulation
				explanations={<Explanation />}
				afterQuestionsSlot={<SelectSimulationYear />}
			>
				<SimulateurWarning simulateur="auto-entrepreneur" />
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
	const { colors } = useContext(ThemeContext)

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
						color: colors.bases.primary[600],
					},
					{
						dottedName: 'impôt . montant',
						title: t('impôt'),
						color: colors.bases.secondary[500],
					},
					{
						dottedName:
							'dirigeant . auto-entrepreneur . cotisations et contributions',
						title: t('Cotisations'),
						color: colors.bases.secondary[300],
					},
				]}
			/>
			<InstitutionsPartenairesAutoEntrepreneur />
		</section>
	)
}
