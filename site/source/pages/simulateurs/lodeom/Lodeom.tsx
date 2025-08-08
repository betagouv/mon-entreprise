import { useState } from 'react'
import { Trans } from 'react-i18next'

import EffectifSwitch from '@/components/RéductionDeCotisations/EffectifSwitch'
import RégularisationSwitch from '@/components/RéductionDeCotisations/RégularisationSwitch'
import SimulateurWarning from '@/components/SimulateurWarning'
import Simulation from '@/components/Simulation'
import { YearSelectionBanner } from '@/components/Simulation/YearSelectionBanner'
import { Body, Emoji } from '@/design-system'
import { useZoneLodeom } from '@/hooks/useZoneLodeom'
import { RégularisationMethod } from '@/utils/réductionDeCotisations'

import BarèmeSwitch from './components/BarèmeSwitch'
import ZoneSwitch from './components/ZoneSwitch'
import LodeomSimulationGoals from './Goals'

export default function LodeomSimulation() {
	const currentZone = useZoneLodeom()

	const [régularisationMethod, setRégularisationMethod] =
		useState<RégularisationMethod>('progressive')

	return (
		<>
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
		</>
	)
}
