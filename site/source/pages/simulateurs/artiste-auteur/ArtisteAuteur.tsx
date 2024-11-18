import { useContext } from 'react'
import { Trans } from 'react-i18next'
import { useLocation } from 'react-router-dom'

import { Condition } from '@/components/EngineValue/Condition'
import PeriodSwitch from '@/components/PeriodSwitch'
import { SelectSimulationYear } from '@/components/SelectSimulationYear'
import SimulateurWarning from '@/components/SimulateurWarning'
import Simulation, {
	SimulationGoal,
	SimulationGoals,
} from '@/components/Simulation'
import { DistributionBranch } from '@/components/simulationExplanation/DistributionDesCotisations'
import { InstitutionsPartenairesArtisteAuteur } from '@/components/simulationExplanation/InstitutionsPartenaires'
import { EngineContext } from '@/components/utils/EngineContext'
import { H2 } from '@/design-system/typography/heading'
import useSimulationConfig from '@/hooks/useSimulationConfig'

import { configArtisteAuteur } from './simulationConfig'

export default function ArtisteAuteur() {
	const { pathname } = useLocation()
	useSimulationConfig({ key: pathname, config: configArtisteAuteur })

	return (
		<>
			<Simulation
				explanations={<CotisationsResult />}
				afterQuestionsSlot={<SelectSimulationYear />}
			>
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
