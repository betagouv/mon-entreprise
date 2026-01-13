import { Trans, useTranslation } from 'react-i18next'

import SimulateurWarning from '@/components/SimulateurWarning'
import Simulation from '@/components/Simulation'
import { YearSelectionBanner } from '@/components/Simulation/YearSelectionBanner'
import IndépendantExplanation from '@/components/simulationExplanation/IndépendantExplanation'
import { Body, Emoji, Link, Message, Strong } from '@/design-system'
import { IndépendantSimulationGoals } from '@/pages/simulateurs/indépendant/Goals'

export const EntrepriseIndividuelle = () => {
	const { t } = useTranslation()

	return (
		<>
			<Simulation
				explanations={<IndépendantExplanation />}
				afterQuestionsSlot={<YearSelectionBanner />}
			>
				<SimulateurWarning
					simulateur="entreprise-individuelle"
					informationsComplémentaires={
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
					}
				/>
				<IndépendantSimulationGoals />
			</Simulation>
		</>
	)
}
