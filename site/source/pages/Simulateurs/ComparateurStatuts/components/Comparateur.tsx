import Engine from 'publicodes'
import { useTranslation } from 'react-i18next'

import { DottedName } from '@/../../modele-social'
import PeriodSwitch from '@/components/PeriodSwitch'
import Simulation, {
	SimulationGoal,
	SimulationGoals,
} from '@/components/Simulation'
import { Spacing } from '@/design-system/layout'

import Détails from './Détails'
import Résultats from './Résultats'

type ComparateurProps = {
	engines: [Engine<DottedName>, Engine<DottedName>, Engine<DottedName>]
}

function Comparateur({ engines }: ComparateurProps) {
	const { t } = useTranslation()

	return (
		<>
			<Simulation
				engines={engines}
				hideDetails
				showQuestionsFromBeginning
				fullWidth
				id="simulation-comparateur"
			>
				<SimulationGoals
					toggles={<PeriodSwitch />}
					legend={'Estimations sur votre rémunération brute et vos charges'}
				>
					<SimulationGoal
						dottedName="entreprise . chiffre d'affaires"
						isInfoMode
						label={t("Chiffre d'affaires estimé")}
					/>
					<SimulationGoal dottedName="entreprise . charges" isInfoMode />
				</SimulationGoals>
			</Simulation>
			<Spacing md />
			<Résultats engines={engines} />
			<Détails engines={engines} />
		</>
	)
}

export default Comparateur
