import { updateSituation } from 'Actions/actions'
import Banner from 'Components/Banner'
import { Condition } from 'Components/EngineValue'
import PeriodSwitch from 'Components/PeriodSwitch'
import SimulateurWarning from 'Components/SimulateurWarning'
import Simulation from 'Components/Simulation'
import IndépendantExplanation from 'Components/simulationExplanation/IndépendantExplanation'
import { SimulationGoal, SimulationGoals } from 'Components/SimulationGoals'
import { useEngine } from 'Components/utils/EngineContext'
import { SitePathsContext } from 'Components/utils/SitePathsContext'
import { DottedName } from 'modele-social'
import { useContext } from 'react'
import { Trans } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'

export function IndépendantPLSimulation() {
	return (
		<>
			<SimulateurWarning simulateur="profession-libérale" />
			<Simulation explanations={<IndépendantExplanation />}>
				<PeriodSwitch />
				<IndépendantSimulationGoals />
			</Simulation>
		</>
	)
}

export default function IndépendantSimulation() {
	const sitePaths = useContext(SitePathsContext)
	return (
		<>
			<SimulateurWarning simulateur="indépendant" />
			<Simulation explanations={<IndépendantExplanation />}>
				<div
					css={`
						display: flex;
						flex-wrap: wrap-reverse;
						> * {
							margin-top: 0.6rem;
						}
						justify-content: center;

						@media (min-width: 590px) {
							justify-content: space-between;
						}
					`}
				>
					<ImpositionSwitch />
					<PeriodSwitch />
				</div>
				<IndépendantSimulationGoals />
				<Banner icon={'✍️'}>
					<Trans i18nKey="aide-déclaration-indépendant.banner">
						Découvrez notre outil d'
						<Link to={sitePaths.gérer.déclarationIndépendant}>
							aide à la déclaration des revenus
						</Link>
					</Trans>
				</Banner>
			</Simulation>
		</>
	)
}
function IndépendantSimulationGoals() {
	return (
		<SimulationGoals className="plain">
			<Condition expression="entreprise . imposition = 'IR'">
				<SimulationGoal
					appear={false}
					alwaysShow
					dottedName="entreprise . chiffre d'affaires"
				/>
				<Condition expression="entreprise . imposition . IR . micro-fiscal != oui">
					<SimulationGoal
						small
						appear={false}
						dottedName="entreprise . charges"
					/>
				</Condition>
			</Condition>
			<Condition expression="entreprise . imposition = 'IS'">
				<SimulationGoal
					appear={false}
					dottedName="dirigeant . rémunération . totale"
				/>
			</Condition>

			<SimulationGoal
				small
				editable={false}
				alwaysShow
				dottedName="dirigeant . indépendant . cotisations et contributions"
			/>
			<Condition expression="entreprise . imposition . IR . micro-fiscal">
				<SimulationGoal
					small
					appear={false}
					dottedName="entreprise . charges"
				/>
			</Condition>
			<SimulationGoal dottedName="dirigeant . rémunération . nette" />
			<Condition expression="entreprise . chiffre d'affaires">
				<SimulationGoal small editable={false} dottedName="impôt" />
			</Condition>
			<SimulationGoal dottedName="dirigeant . rémunération . nette après impôt" />
		</SimulationGoals>
	)
}

function ImpositionSwitch() {
	const dispatch = useDispatch()
	const engine = useEngine()
	const currentImposition = engine.evaluate('entreprise . imposition').nodeValue

	return (
		<span className="base ui__ small radio toggle">
			{(['IR', 'IS'] as const).map((imposition) => (
				<label key={imposition}>
					<input
						name="entreprise . imposition"
						type="radio"
						value={imposition}
						onChange={() =>
							dispatch(
								updateSituation('entreprise . imposition', `'${imposition}'`)
							)
						}
						checked={currentImposition === imposition}
					/>
					<span>
						{
							engine.getRule(
								`entreprise . imposition . ${imposition}` as DottedName
							).title
						}
					</span>
				</label>
			))}
		</span>
	)
}
