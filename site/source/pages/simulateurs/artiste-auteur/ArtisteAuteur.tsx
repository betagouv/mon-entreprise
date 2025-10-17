import { Trans } from 'react-i18next'

import { Condition } from '@/components/EngineValue/Condition'
import PeriodSwitch from '@/components/PeriodSwitch'
import SimulateurWarning from '@/components/SimulateurWarning'
import Simulation, {
	SimulationGoal,
	SimulationGoals,
} from '@/components/Simulation'
import { YearSelectionBanner } from '@/components/Simulation/YearSelectionBanner'
import { DistributionBranch } from '@/components/simulationExplanation/DistributionDesCotisations'
import { InstitutionsPartenairesArtisteAuteur } from '@/components/simulationExplanation/InstitutionsPartenaires'
import { typography } from '@/design-system'
import { useEngine } from '@/hooks/useEngine'
import useSimulationConfig from '@/hooks/useSimulationConfig'
import { useNavigation } from '@/lib/navigation'

import { configArtisteAuteur } from './simulationConfig'

const { Body, H2 } = typography

export default function ArtisteAuteur() {
	const { currentPath } = useNavigation()
	useSimulationConfig({ key: currentPath, config: configArtisteAuteur })

	return (
		<>
			<Simulation
				results={<InstitutionsPartenairesArtisteAuteur />}
				explanations={<CotisationsResult />}
				afterQuestionsSlot={<YearSelectionBanner />}
			>
				<SimulateurWarning
					simulateur="artiste-auteur"
					informationsComplémentaires={
						<Body>
							<Trans i18nKey="pages.simulateurs.artiste-auteur.warning">
								Ce simulateur permet d’estimer le montant de vos cotisations à
								partir de votre revenu projeté.
							</Trans>
						</Body>
					}
				/>
				<SimulationGoals>
					<PeriodSwitch />
					<SimulationGoal dottedName="artiste-auteur . revenus . traitements et salaires" />
					<SimulationGoal dottedName="artiste-auteur . revenus . BNC . recettes" />
					<SimulationGoal dottedName="artiste-auteur . revenus . BNC . frais réels" />
				</SimulationGoals>
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
	const engine = useEngine()
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
