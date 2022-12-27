import Engine from 'publicodes'
import { Trans } from 'react-i18next'
import styled from 'styled-components'

import { DottedName } from '@/../../modele-social'
import PeriodSwitch from '@/components/PeriodSwitch'
import { StyledGrid } from '@/components/SchemeComparaison'
import Simulation, {
	SimulationGoal,
	SimulationGoals,
} from '@/components/Simulation'
import {
	SimulationGoalsContainer,
	ToggleSection,
} from '@/components/Simulation/SimulationGoals'
import { Emoji } from '@/design-system/emoji'
import { Spacing } from '@/design-system/layout'
import { H2, H3 } from '@/design-system/typography/heading'

import Détails from './Détails'
import Résultats from './Résultats'
import TableRow from './TableRow'

type ComparateurProps = {
	engines: [Engine<DottedName>, Engine<DottedName>, Engine<DottedName>]
}

function Comparateur({ engines }: ComparateurProps) {
	return (
		<>
			<Simulation
				engines={engines}
				hideDetails
				showQuestionsFromBeginning
				fullWidth
				id="simulation-comparateur"
			>
				<StyledSimulationGoals
					toggles={<PeriodSwitch mode="tab" />}
					legend={'Estimations sur votre rémunération brute et vos charges'}
				>
					<SimulationGoal
						dottedName="entreprise . chiffre d'affaires"
						isInfoMode
					/>
					<SimulationGoal dottedName="entreprise . charges" isInfoMode />
				</StyledSimulationGoals>
			</Simulation>
			<Spacing md />
			<Résultats engines={engines} />
			<Détails engines={engines} />
		</>
	)
}

export default Comparateur

const StyledSimulationGoals = styled(SimulationGoals)`
	${SimulationGoalsContainer} {
		border-start-end-radius: 0;
		border-end-start-radius: 0;
		border-end-end-radius: 0;
	}
	${ToggleSection} {
		padding-bottom: 0;
	}
`
