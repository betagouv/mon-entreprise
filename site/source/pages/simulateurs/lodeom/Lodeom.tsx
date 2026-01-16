import { useState } from 'react'
import { Trans } from 'react-i18next'

import EffectifSwitch from '@/components/RéductionDeCotisations/EffectifSwitch'
import RégularisationSwitch from '@/components/RéductionDeCotisations/RégularisationSwitch'
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
import { useZoneLodeom } from '@/hooks/useZoneLodeom'
import { EngineProvider } from '@/utils/publicodes/EngineContext'
import { RégularisationMethod } from '@/utils/réductionDeCotisations'

import SimulateurPageLayout from '../SimulateurPageLayout'
import BarèmeSwitch from './components/BarèmeSwitch'
import ZoneSwitch from './components/ZoneSwitch'
import LodeomSimulationGoals from './Goals'

const nextSteps = ['salarié'] satisfies SimulateurId[]

const externalLinks = [
	serviceEmployeur,
	embaucherGérerSalariés,
	nouvelEmployeur,
]

export default function LodeomSimulation() {
	const id = 'auto-entrepreneur'
	const simulateurConfig = useSimulatorData(id)
	const { isReady, engine } = useSimulationPublicodes(simulateurConfig)

	const currentZone = useZoneLodeom()

	const [régularisationMethod, setRégularisationMethod] =
		useState<RégularisationMethod>('progressive')

	return (
		<EngineProvider value={engine}>
			<SimulateurPageLayout
				simulateurConfig={simulateurConfig}
				isReady={isReady}
				nextSteps={nextSteps}
				externalLinks={externalLinks}
			>
				<Simulation afterQuestionsSlot={<YearSelectionBanner />}>
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
					<LodeomSimulationGoals
						toggles={
							<>
								<ZoneSwitch />
								<BarèmeSwitch />
								{currentZone === 'zone un' && (
									<>
										<RégularisationSwitch
											régularisationMethod={régularisationMethod}
											setRégularisationMethod={setRégularisationMethod}
										/>
										<EffectifSwitch />
									</>
								)}
							</>
						}
						régularisationMethod={
							currentZone === 'zone un' ? régularisationMethod : undefined
						}
					/>
				</Simulation>
			</SimulateurPageLayout>
		</EngineProvider>
	)
}
