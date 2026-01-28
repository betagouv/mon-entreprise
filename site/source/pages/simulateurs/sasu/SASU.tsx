import { Trans } from 'react-i18next'

import PeriodSwitch from '@/components/PeriodSwitch'
import RuleLink from '@/components/RuleLink'
import SimulateurWarning from '@/components/SimulateurWarning'
import Simulation, {
	SimulationGoal,
	SimulationGoals,
} from '@/components/Simulation'
import { YearSelectionBanner } from '@/components/Simulation/YearSelectionBanner'
import { Body, H2 } from '@/design-system'
import { useDocumentationPath } from '@/hooks/useDocumentationIndexPath'
import { useEngineFromModèle } from '@/hooks/useEngineFromModèle'
import useSimulationPublicodes from '@/hooks/useSimulationPublicodes'
import { useSimulatorData } from '@/hooks/useSimulatorData'
import { SimulateurId } from '@/hooks/useSimulatorsData'
import { EngineProvider } from '@/utils/publicodes/EngineContext'

import SimulateurPageLayout from '../SimulateurPageLayout'
import ExplicationsSalaire from './components/Explications'

const nextSteps = ['is', 'comparaison-statuts'] satisfies SimulateurId[]

export function SASUSimulation() {
	const id = 'sasu'
	const simulateurConfig = useSimulatorData(id)
	const { isReady, engine, questions, raccourcis } =
		useSimulationPublicodes(simulateurConfig)

	return (
		<EngineProvider value={engine}>
			<SimulateurPageLayout
				simulateurConfig={simulateurConfig}
				isReady={isReady}
				nextSteps={nextSteps}
			>
				<Simulation
					questionsPublicodes={questions}
					raccourcisPublicodes={raccourcis}
					explanations={<ExplicationsSalaire />}
					afterQuestionsSlot={<YearSelectionBanner />}
				>
					<SimulateurWarning
						simulateur="sasu"
						informationsComplémentaires={
							<Body>
								<Trans i18nKey="pages.simulateurs.sasu.warning">
									Ce simulateur ne gère pas le cas des SAS(U) à l’impôt sur le
									revenu (IR). Seule l’option pour l’impôt sur les sociétés est
									implémentée (IS).
								</Trans>
							</Body>
						}
					/>
					<SimulationGoals>
						<PeriodSwitch />
						<SimulationGoal dottedName="assimilé salarié . rémunération . totale" />
						<SimulationGoal
							editable
							small
							dottedName="assimilé salarié . rémunération . brute"
						/>
						<SimulationGoal
							editable={false}
							small
							dottedName="assimilé salarié . cotisations"
						/>
						<SimulationGoal dottedName="assimilé salarié . rémunération . nette . à payer avant impôt" />
						<SimulationGoal
							small
							editable={false}
							dottedName="assimilé salarié . rémunération . impôt"
						/>
						<SimulationGoal dottedName="assimilé salarié . rémunération . nette . après impôt" />
					</SimulationGoals>
				</Simulation>
			</SimulateurPageLayout>
		</EngineProvider>
	)
}

export const SeoExplanations = () => {
	const documentationPathModèleSocial = useDocumentationPath('modele-social')
	const engineModeleSocial = useEngineFromModèle('modele-social')

	return (
		<Trans i18nKey="pages.simulateurs.sasu.seo-explanation">
			<H2>Comment calculer le salaire d'un dirigeant de SAS ou SASU ? </H2>
			<Body>
				Comme pour un salarié classique, le <strong>dirigeant de SAS(U)</strong>{' '}
				paye des cotisations sociales sur la rémunération qu'il se verse. Les
				cotisations sont calculées de la même manière que pour le salarié :
				elles sont décomposées en partie employeur et partie salarié et sont
				exprimées comme un pourcentage du salaire brut.
			</Body>
			<Body>
				Le dirigeant assimilé-salarié ne paye pas de{' '}
				<strong>cotisations chômage</strong>. Par ailleurs, il ne bénéficie pas
				de la{' '}
				<RuleLink
					dottedName="salarié . cotisations . exonérations . réduction générale"
					engine={engineModeleSocial}
					documentationPath={documentationPathModèleSocial}
				>
					réduction générale de cotisations
				</RuleLink>{' '}
				ni des dispositifs encadrés par le code du travail comme les{' '}
				<RuleLink
					dottedName="salarié . temps de travail . heures supplémentaires"
					engine={engineModeleSocial}
					documentationPath={documentationPathModèleSocial}
				>
					heures supplémentaires
				</RuleLink>{' '}
				ou les primes.
			</Body>
			<Body>
				Il peut en revanche prétendre à la{' '}
				<RuleLink dottedName="assimilé salarié . exonérations . Acre">
					réduction Acre
				</RuleLink>{' '}
				en debut d'activité, sous certaines conditions.
			</Body>
			<Body>
				Vous pouvez utiliser notre simulateur pour calculer la{' '}
				<strong>rémunération nette</strong> à partir d'un montant superbrut
				alloué à la rémunération du dirigeant. Il vous suffit pour cela saisir
				le montant total alloué dans la case "total chargé". La simulation peut
				ensuite être affinée en répondant aux différentes questions.
			</Body>
		</Trans>
	)
}
