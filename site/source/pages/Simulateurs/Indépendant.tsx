import { updateSituation } from '@/actions/actions'
import ChiffreAffairesActivitéMixte from '@/components/ChiffreAffairesActivitéMixte'
import { Condition } from '@/components/EngineValue'
import PeriodSwitch from '@/components/PeriodSwitch'
import SimulateurWarning from '@/components/SimulateurWarning'
import Simulation, {
	SimulationGoal,
	SimulationGoals,
} from '@/components/Simulation'
import IndépendantExplanation from '@/components/simulationExplanation/IndépendantExplanation'
import { useEngine } from '@/components/utils/EngineContext'
import { Radio, ToggleGroup } from '@/design-system/field'
import { DottedName } from 'modele-social'
import { useDispatch } from 'react-redux'
import { SelectSimulationYear } from '@/components/SelectSimulationYear'
import { useEffect, useState } from 'react'

export function IndépendantPLSimulation() {
	return (
		<>
			<Simulation
				explanations={<IndépendantExplanation />}
				afterQuestionsSlot={<SelectSimulationYear />}
			>
				<SimulateurWarning simulateur="profession-libérale" />
				<IndépendantSimulationGoals legend="Vos revenus de profession libérale" />
			</Simulation>
		</>
	)
}

export function EntrepriseIndividuelle() {
	return (
		<>
			<Simulation
				explanations={<IndépendantExplanation />}
				afterQuestionsSlot={<SelectSimulationYear />}
			>
				<SimulateurWarning simulateur="entreprise-individuelle" />
				<IndépendantSimulationGoals legend="Vos revenus d'entreprise individuelle" />
			</Simulation>
		</>
	)
}

export default function IndépendantSimulation() {
	return (
		<>
			<Simulation
				explanations={<IndépendantExplanation />}
				afterQuestionsSlot={<SelectSimulationYear />}
			>
				<SimulateurWarning simulateur="indépendant" />
				<IndépendantSimulationGoals
					legend="Vos revenus d'indépendant"
					toggles={
						<>
							<ImpositionSwitch />

							<PeriodSwitch />
						</>
					}
				/>
			</Simulation>
		</>
	)
}

function IndépendantSimulationGoals({
	toggles = <PeriodSwitch />,
	legend,
}: {
	toggles?: React.ReactNode
	legend: string
}) {
	return (
		<SimulationGoals toggles={toggles} legend={legend}>
			<Condition expression="entreprise . imposition = 'IR'">
				<Condition expression="entreprise . imposition . régime . micro-entreprise = non">
					<SimulationGoal
						appear={false}
						dottedName="entreprise . chiffre d'affaires"
					/>
				</Condition>
				<Condition expression="entreprise . imposition . régime . micro-entreprise">
					<ChiffreAffairesActivitéMixte dottedName="entreprise . chiffre d'affaires" />
				</Condition>
				<Condition expression="entreprise . imposition . régime . micro-entreprise != oui">
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
				dottedName="dirigeant . indépendant . cotisations et contributions"
			/>
			<Condition expression="entreprise . imposition . régime . micro-entreprise">
				<SimulationGoal
					small
					appear={false}
					dottedName="entreprise . charges"
				/>
			</Condition>
			<SimulationGoal dottedName="dirigeant . rémunération . nette" />
			<Condition expression="impôt . montant > 0">
				<SimulationGoal small editable={false} dottedName="impôt . montant" />
			</Condition>
			<SimulationGoal dottedName="dirigeant . rémunération . nette après impôt" />
		</SimulationGoals>
	)
}

function ImpositionSwitch() {
	const dispatch = useDispatch()
	const engine = useEngine()
	const engineImposition = engine.evaluate('entreprise . imposition')
		.nodeValue as string
	const [currentImposition, setCurrentImposition] = useState(engineImposition)

	useEffect(() => {
		if (currentImposition !== engineImposition) {
			setCurrentImposition(engineImposition)
		}
	}, [currentImposition, engineImposition])

	return (
		<ToggleGroup
			value={currentImposition}
			onChange={(imposition) => {
				setCurrentImposition(imposition)
				dispatch(updateSituation('entreprise . imposition', `'${imposition}'`))
			}}
		>
			{(['IR', 'IS'] as const).map((imposition) => (
				<span
					key={imposition}
					className={currentImposition !== imposition ? 'print-hidden' : ''}
				>
					<Radio value={imposition}>
						{
							engine.getRule(
								`entreprise . imposition . ${imposition}` as DottedName
							).title
						}
					</Radio>
				</span>
			))}
		</ToggleGroup>
	)
}
