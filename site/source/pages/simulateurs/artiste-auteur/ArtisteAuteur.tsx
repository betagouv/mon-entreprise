import { useContext } from 'react'
import { Trans } from 'react-i18next'

import { DistributionBranch } from '@/components/Distribution'
import { Condition } from '@/components/EngineValue'
import PeriodSwitch from '@/components/PeriodSwitch'
import SimulateurWarning from '@/components/SimulateurWarning'
import Simulation, {
	SimulationGoal,
	SimulationGoals,
} from '@/components/Simulation'
import { InstitutionsPartenairesArtisteAuteur , TestSeoExplanations } from '@/components/simulationExplanation/InstitutionsPartenaires'
import { EngineContext } from '@/components/utils/EngineContext'
import { H2 } from '@/design-system/typography/heading'
import useSimulationConfig from '@/hooks/useSimulationConfig'

import { configArtisteAuteur } from './simulationConfig'

export default function ArtisteAuteur() {
	useSimulationConfig({ key: 'artiste-auteur', config: configArtisteAuteur })

	return (
		<>
			<Simulation explanations={<CotisationsResult />}>
				<SimulateurWarning simulateur="artiste-auteur" />
				<SimulationGoals
					legend="Vos revenus d'artiste auteur"
					toggles={<PeriodSwitch />}
				>
					<SimulationGoal dottedName="artiste-auteur . revenus . traitements et salaires" />
					<SimulationGoal dottedName="artiste-auteur . revenus . BNC . recettes" />
					<SimulationGoal dottedName="artiste-auteur . revenus . BNC . frais réels" />
				</SimulationGoals>

				<InstitutionsPartenairesArtisteAuteur />
				<TestSeoExplanations/>
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
			<H2>
				<Trans>À quoi servent mes cotisations ?</Trans>
			</H2>
			<H2>Comment calculer l'impôt sur le revenu pour un auto-entrepreneur ?</H2>
			<div className="distribution-chart__container" role="list">
				{cotisations
					.filter(({ value }) => Boolean(value))
					.map((cotisation) => (
						<DistributionBranch
							key={cotisation.dottedName}
							maximum={maximum}
							role="listitem"
							{...cotisation}
						/>
					))}

					
			</div>
			
		</section>
	)



}

