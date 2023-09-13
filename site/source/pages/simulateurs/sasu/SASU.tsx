import { Trans } from 'react-i18next'

import PeriodSwitch from '@/components/PeriodSwitch'
import RuleLink from '@/components/RuleLink'
import SimulateurWarning from '@/components/SimulateurWarning'
import Simulation, {
	SimulationGoal,
	SimulationGoals,
} from '@/components/Simulation'
import SalaryExplanation from '@/components/simulationExplanation/SalaryExplanation'
import { H2 } from '@/design-system/typography/heading'
import { Body } from '@/design-system/typography/paragraphs'

export function SASUSimulation() {
	return (
		<>
			<Simulation explanations={<SalaryExplanation />}>
				<SimulateurWarning simulateur="sasu" />
				<SimulationGoals
					toggles={<PeriodSwitch />}
					legend="Vos revenus de dirigeant de SASU"
				>
					<SimulationGoal dottedName="dirigeant . rémunération . totale" />
					<SimulationGoal
						editable
						small
						dottedName="salarié . rémunération . brut"
					/>
					<SimulationGoal
						editable={false}
						small
						dottedName="dirigeant . assimilé salarié . cotisations"
					/>
					<SimulationGoal dottedName="salarié . rémunération . net . à payer avant impôt" />
					<SimulationGoal small editable={false} dottedName="impôt . montant" />
					<SimulationGoal dottedName="salarié . rémunération . net . payé après impôt" />
				</SimulationGoals>
			</Simulation>
		</>
	)
}

export const SeoExplanations = () => (
	<Trans i18nKey="pages.simulateurs.sasu.seo-explanation">
		<H2>Comment calculer le salaire d'un dirigeant de SASU ? </H2>
		<Body>
			Comme pour un salarié classique, le <strong>dirigeant de sasu</strong>{' '}
			paye des cotisations sociales sur la rémunération qu'il se verse. Les
			cotisations sont calculées de la même manière que pour le salarié : elles
			sont décomposées en partie employeur et partie salarié et sont exprimées
			comme un pourcentage du salaire brut.
		</Body>
		<Body>
			Le dirigeant assimilé-salarié ne paye pas de{' '}
			<strong>cotisations chômage</strong>. Par ailleurs, il ne bénéficie pas de
			la{' '}
			<RuleLink dottedName="salarié . cotisations . exonérations . réduction générale">
				réduction générale de cotisations
			</RuleLink>{' '}
			ni des dispositifs encadrés par le code du travail comme les{' '}
			<RuleLink dottedName="salarié . temps de travail . heures supplémentaires">
				heures supplémentaires
			</RuleLink>{' '}
			ou les primes.
		</Body>
		<Body>
			Il peut en revanche prétendre à la{' '}
			<RuleLink dottedName="dirigeant . assimilé salarié . réduction ACRE">
				réduction ACRE
			</RuleLink>{' '}
			en debut d'activité, sous certaines conditions.
		</Body>
		<Body>
			Vous pouvez utiliser notre simulateur pour calculer la{' '}
			<strong>rémunération nette</strong> à partir d'un montant superbrut alloué
			à la rémunération du dirigeant. Il vous suffit pour cela saisir le montant
			total alloué dans la case "total chargé". La simulation peut ensuite être
			affinée en répondant aux différentes questions.
		</Body>
	</Trans>
)
