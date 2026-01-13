import { DottedName } from 'modele-social'
import { Trans } from 'react-i18next'
import { useDispatch } from 'react-redux'

import RuleInput from '@/components/conversation/RuleInput'
import SimulateurWarning from '@/components/SimulateurWarning'
import Simulation from '@/components/Simulation'
import { YearSelectionBanner } from '@/components/Simulation/YearSelectionBanner'
import IndépendantExplanation from '@/components/simulationExplanation/IndépendantExplanation'
import { Body, Emoji, Link, Message, Strong } from '@/design-system'
import { ValeurPublicodes } from '@/domaine/engine/PublicodesAdapter'
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
							<Message type="error">
								<Body>
									<Emoji emoji="⚠️" />{' '}
									<Strong>
										<Trans i18nKey="pages.simulateurs.indépendant.warning.réforme.texte">
											La{' '}
											<Link
												href="https://www.urssaf.fr/accueil/independant/comprendre-payer-cotisations/reforme-cotisations-independants.html"
												aria-label={t(
													'pages.simulateurs.indépendant.warning.réforme.aria-label',
													'Lire la page dédiée à la réforme de l’assiette et du barème des cotisations sur le site de l’Urssaf, nouvelle fenêtre'
												)}
											>
												réforme de l’assiette et du barème des cotisations
											</Link>{' '}
											n'est pas encore implémentée sur ce simulateur.
										</Trans>
									</Strong>
								</Body>
							</Message>
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
										} as Record<DottedName, ValeurPublicodes>)
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
