import SimulateurWarning from '@/components/SimulateurWarning'
import Simulation from '@/components/Simulation'
import { Message } from '@/design-system/message'
import { CessationActivitéGoals } from '@/pages/simulateurs/cessation-activité/Goals'
import { CessationActivitéGoalsN1 } from '@/pages/simulateurs/cessation-activité/GoalsN1'

const CessationActivitéExplanation = () => (
	<>
		<Message>Voulez-vous calculer vos cotisations pour N-1 ?</Message>
		<Simulation hideDetails>
			<CessationActivitéGoalsN1 />
		</Simulation>
	</>
)

export const CessationActivitéSimulation = () => {
	return (
		<Simulation explanations={<CessationActivitéExplanation />}>
			<SimulateurWarning simulateur="cessation-activité" />
			<CessationActivitéGoals />
		</Simulation>
	)
}
