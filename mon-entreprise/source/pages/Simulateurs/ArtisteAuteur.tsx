import { DistributionBranch } from 'Components/Distribution'
import { Condition } from 'Components/EngineValue'
import PeriodSwitch from 'Components/PeriodSwitch'
import SimulateurWarning from 'Components/SimulateurWarning'
import Simulation from 'Components/Simulation'
import { InstitutionsPartenairesArtisteAuteur } from 'Components/simulationExplanation/InstitutionsPartenaires'
import { SimulationGoal, SimulationGoals } from 'Components/SimulationGoals'
import { EngineContext } from 'Components/utils/EngineContext'
import 'Components/ObjectifSelection.css'
import useSimulationConfig from 'Components/utils/useSimulationConfig'
import { useContext } from 'react'
import { Trans } from 'react-i18next'
import config from './configs/artiste-auteur.yaml'

export default function ArtisteAuteur() {
	useSimulationConfig(config)

	return (
		<>
			<SimulateurWarning simulateur="artiste-auteur" />
			<Simulation explanations={<CotisationsResult />}>
				<PeriodSwitch />

				<SimulationGoals className="plain">
					<SimulationGoal dottedName="artiste-auteur . revenus . traitements et salaires" />
					<SimulationGoal dottedName="artiste-auteur . revenus . BNC . recettes" />
					<SimulationGoal dottedName="artiste-auteur . revenus . BNC . frais réels" />
				</SimulationGoals>

				<InstitutionsPartenairesArtisteAuteur />
			</Simulation>
		</>
	)
}

function CotisationsResult() {
	return (
		<>
			<Condition expression="artiste-auteur . cotisations > 0">
				<RepartitionCotisations />
			</Condition>
		</>
	)
}

const branches = [
	{
		dottedName: 'artiste-auteur . cotisations . vieillesse',
		icon: '👵',
	},
	{
		dottedName: 'artiste-auteur . cotisations . IRCEC',
		icon: '👵',
	},
	{
		dottedName: 'artiste-auteur . cotisations . CSG-CRDS',
		icon: '🏛',
	},
	{
		dottedName: 'artiste-auteur . cotisations . formation professionnelle',
		icon: '👷‍♂️',
	},
] as const

function RepartitionCotisations() {
	const engine = useContext(EngineContext)
	const cotisations = branches.map((branch) => ({
		...branch,
		value: engine.evaluate(branch.dottedName).nodeValue as number,
	}))
	const maximum = Math.max(...cotisations.map((x) => x.value))
	return (
		<section>
			<h2>
				<Trans>À quoi servent mes cotisations ?</Trans>
			</h2>
			<div className="distribution-chart__container">
				{cotisations
					.filter(({ value }) => Boolean(value))
					.map((cotisation) => (
						<DistributionBranch
							key={cotisation.dottedName}
							maximum={maximum}
							{...cotisation}
						/>
					))}
			</div>
		</section>
	)
}
