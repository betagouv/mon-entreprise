import { Trans } from 'react-i18next'

import SimulateurWarning from '@/components/SimulateurWarning'
import Simulation from '@/components/Simulation'
import { YearSelectionBanner } from '@/components/Simulation/YearSelectionBanner'
import { Body, Emoji } from '@/design-system'
import { embaucherGérerSalariés } from '@/external-links/embaucherGérerSalariés'
import { nouvelEmployeur } from '@/external-links/nouvelEmployeur'
import { serviceEmployeur } from '@/external-links/serviceEmployeur'
import useSimulationPublicodes from '@/hooks/useSimulationPublicodes'
import { useSimulatorData } from '@/hooks/useSimulatorData'
import { SimulateurId } from '@/hooks/useSimulatorsData'
import { EngineProvider } from '@/utils/publicodes/EngineContext'

import SimulateurPageLayout from '../SimulateurPageLayout'
import LodeomSimulationGoals from './Goals'

const nextSteps = ['salarié'] satisfies SimulateurId[]

const externalLinks = [
	serviceEmployeur,
	embaucherGérerSalariés,
	nouvelEmployeur,
]

export default function LodeomSimulation() {
	const id = 'lodeom'
	const simulateurConfig = useSimulatorData(id)
	const { isReady, engine, questions, raccourcis } =
		useSimulationPublicodes(simulateurConfig)

	return (
		<EngineProvider value={engine}>
			<SimulateurPageLayout
				simulateurConfig={simulateurConfig}
				isReady={isReady}
				nextSteps={nextSteps}
				externalLinks={externalLinks}
			>
				<Simulation
					questionsPublicodes={questions}
					raccourcisPublicodes={raccourcis}
					afterQuestionsSlot={<YearSelectionBanner />}
				>
					<SimulateurWarning
						simulateur="lodeom"
						informationsComplémentaires={
							<Body>
								<Trans i18nKey="pages.simulateurs.lodeom.warning">
									<Emoji emoji="⚠️" /> Les taux et répartitions de cotisations
									dérogatoires ne sont pas pris en compte.
								</Trans>
							</Body>
						}
					/>
					<LodeomSimulationGoals />
				</Simulation>
			</SimulateurPageLayout>
		</EngineProvider>
	)
}
