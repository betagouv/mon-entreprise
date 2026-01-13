import { Trans, useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import SimulateurWarning from '@/components/SimulateurWarning'
import Simulation from '@/components/Simulation'
import { Body, Emoji, Link, Message, Strong } from '@/design-system'
import { MergedSimulatorDataValues } from '@/hooks/useCurrentSimulatorData'
import useSimulatorsData from '@/hooks/useSimulatorsData'
import { useUrl } from '@/hooks/useUrl'
import { CessationActivitéGoals } from '@/pages/simulateurs/cessation-activité/Goals'
import {
	companySituationSelector,
	situationSelector,
} from '@/store/selectors/simulationSelectors'
import { omit } from '@/utils'

export const CessationActivitéSimulation = () => {
	const situation = {
		...useSelector(situationSelector),
		...useSelector(companySituationSelector),
	}

	const filteredSituation = omit(situation, 'entreprise . date de cessation')
	const path = useSimulatorsData().indépendant
		.path as Partial<MergedSimulatorDataValues>
	const lien = useUrl({ path, situation: filteredSituation })

	const { t } = useTranslation()

	return (
		<Simulation
			customSimulationbutton={{
				href: lien,
				title: t('Vos cotisations pour l’année précédente'),
			}}
		>
			<SimulateurWarning
				simulateur="cessation-activité"
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
						<Body>
							Vous êtes travailleur indépendant, vous souhaitez estimer les
							cotisations dues avant de cesser votre activité. Ce simulateur est
							là pour vous aider. A noter que le montant indiqué par ce
							simulateur est une estimation. Seule le "décompte réel de
							l'Urssaf" vous permettra de connaitre le montant exact.{' '}
						</Body>
						<Body>
							<strong>Ce simulateur ne tient pas compte</strong> des versements
							déjà effectués et des cotisations provisionnelles déjà appelées
							ainsi que des éventuelles dettes
						</Body>
					</>
				}
			/>
			<CessationActivitéGoals />
		</Simulation>
	)
}
