import { updateSituation } from 'Actions/actions'
import Banner from 'Components/Banner'
import ChiffreAffairesActivitéMixte from 'Components/ChiffreAffairesActivitéMixte'
import { Condition } from 'Components/EngineValue'
import PeriodSwitch from 'Components/PeriodSwitch'
import SimulateurWarning from 'Components/SimulateurWarning'
import Simulation from 'Components/Simulation'
import IndépendantExplanation from 'Components/simulationExplanation/IndépendantExplanation'
import { SimulationGoal, SimulationGoals } from 'Components/SimulationGoals'
import { useEngine } from 'Components/utils/EngineContext'
import { SitePathsContext } from 'Components/utils/SitePathsContext'
import { DottedName } from 'modele-social'
import { useContext, useState } from 'react'
import { Trans } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'

interface IndépendantSimulationProps
{
	disableAnimation: boolean
}

export function IndépendantPLSimulation({disableAnimation}: IndépendantSimulationProps) {
	const [animationDisabled, setAnimationDisabled] = useState(false);
	return (
		<>
			<SimulateurWarning simulateur="profession-libérale" />
			<Simulation userWillExport={()=>{setAnimationDisabled(true)}}
									disableAnimation={animationDisabled}
									explanations={<IndépendantExplanation disableAnimation={animationDisabled} />}>
				<PeriodSwitch />
				<IndépendantSimulationGoals />
			</Simulation>
		</>
	)
}

export function EntrepriseIndividuelle({disableAnimation}: IndépendantSimulationProps) {
	const [animationDisabled, setAnimationDisabled] = useState(false);
	return (
		<>
			<SimulateurWarning simulateur="entreprise-individuelle" />
			<Simulation userWillExport={()=>{setAnimationDisabled(true)}}
									disableAnimation={animationDisabled}
									explanations={<IndépendantExplanation disableAnimation={animationDisabled}/>}>
				<PeriodSwitch />
				<IndépendantSimulationGoals />
			</Simulation>
		</>
	)
}

export default function IndépendantSimulation({disableAnimation}: IndépendantSimulationProps) {
	const sitePaths = useContext(SitePathsContext)
	const [animationDisabled, setAnimationDisabled] = useState(false);
	return (
		<>
			<SimulateurWarning simulateur="indépendant" />
			<Simulation userWillExport={()=>{setAnimationDisabled(true)}}
									disableAnimation={animationDisabled}
									explanations={<IndépendantExplanation disableAnimation={animationDisabled}/>}>
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
				<Condition expression="entreprise . imposition . IR . micro-fiscal = non">
					<SimulationGoal
						appear={false}
						alwaysShow
						dottedName="entreprise . chiffre d'affaires"
					/>
				</Condition>
				<Condition expression="entreprise . imposition . IR . micro-fiscal">
					<ChiffreAffairesActivitéMixte dottedName="entreprise . chiffre d'affaires" />
				</Condition>
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
			<Condition expression="entreprise . chiffre d'affaires > 0">
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
				<label key={imposition} className={ currentImposition !== imposition ? 'print-display-none' : ''}>
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
