import { Trans } from 'react-i18next'
import { useDispatch } from 'react-redux'

import RuleInput from '@/components/conversation/RuleInput'
import SimulateurWarning from '@/components/SimulateurWarning'
import Simulation from '@/components/Simulation'
import { YearSelectionBanner } from '@/components/Simulation/YearSelectionBanner'
import IndépendantExplanation from '@/components/simulationExplanation/IndépendantExplanation'
import { Body } from '@/design-system'
import { ValeurPublicodes } from '@/domaine/engine/PublicodesAdapter'
import { DottedName } from '@/domaine/publicodes/DottedName'
import { useCurrentSimulatorData } from '@/hooks/useCurrentSimulatorData'
import useYear from '@/hooks/useYear'
import { IndépendantSimulationGoals } from '@/pages/simulateurs/indépendant/Goals'
import { ajusteLaSituation } from '@/store/actions/actions'

export default function IndépendantSimulation() {
	const dispatch = useDispatch()
	const year = useYear()
	const { currentSimulatorData } = useCurrentSimulatorData()
	const WarningComponent = currentSimulatorData?.warning

	return (
		<>
			<Simulation
				explanations={<IndépendantExplanation />}
				afterQuestionsSlot={<YearSelectionBanner />}
			>
				<SimulateurWarning
					simulateur="indépendant"
					informationsComplémentaires={
						<>
							{WarningComponent && <WarningComponent />}
							<Body>
								<Trans i18nKey="pages.simulateurs.indépendant.warning">
									Le montant calculé correspond aux cotisations de l’année{' '}
									{{ year }} (pour un revenu {{ year }}).
								</Trans>
							</Body>
						</>
					}
				/>
				<IndépendantSimulationGoals
					toggles={
						<>
							<RuleInput
								inputType="toggle"
								hideDefaultValue
								missing={false}
								dottedName="entreprise . imposition"
								onChange={(imposition) => {
									dispatch(
										ajusteLaSituation({
											'entreprise . imposition': imposition,
										} as Record<DottedName, ValeurPublicodes | undefined>)
									)
								}}
							/>
						</>
					}
				/>
			</Simulation>
		</>
	)
}
