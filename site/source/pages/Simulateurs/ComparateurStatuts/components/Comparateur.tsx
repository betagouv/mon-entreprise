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
			<StyledGrid>
				<H3 className="AS">
					<Emoji emoji="☂" /> <Trans>SASU</Trans>
				</H3>
				<H3 className="indep">
					<Emoji emoji="👩‍🔧" /> <Trans>EI / EURL</Trans>
				</H3>
				<H3 className="auto">
					<Emoji emoji="🚶‍♂️" /> <Trans>Auto-entrepreneur</Trans>
				</H3>

				<TableRow
					dottedName="dirigeant . rémunération . net . après impôt"
					unit="€/mois"
					precision={0}
					engines={engines}
				/>

				<H2 className="all">
					<Spacing lg /> Retraite
				</H2>

				<TableRow
					dottedName="protection sociale . retraite . trimestres"
					engines={engines}
				/>
				<TableRow
					dottedName="protection sociale . retraite . base"
					engines={engines}
				/>
				<TableRow
					dottedName="protection sociale . retraite . complémentaire"
					engines={engines}
				/>

				<H2 className="all">
					<Spacing lg /> Santé
				</H2>
				<TableRow
					dottedName="protection sociale . maladie . arrêt maladie"
					precision={0}
					engines={engines}
				/>
				<TableRow
					dottedName="protection sociale . maladie . arrêt maladie . délai d'attente"
					engines={engines}
				/>
				<TableRow
					dottedName="protection sociale . maladie . arrêt maladie . délai de carence"
					engines={engines}
				/>
			</StyledGrid>
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
