import { updateSituation } from 'Actions/actions'
import { Condition } from 'Components/EngineValue'
import PeriodSwitch from 'Components/PeriodSwitch'
import SimulateurWarning from 'Components/SimulateurWarning'
import Simulation from 'Components/Simulation'
import IndépendantExplanation from 'Components/simulationExplanation/IndépendantExplanation'
import { SimulationGoal, SimulationGoals } from 'Components/SimulationGoals'
import { useEngine } from 'Components/utils/EngineContext'
import { DottedName } from 'modele-social'
import { useDispatch } from 'react-redux'

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
			<Condition expression="impôt > 0">
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
