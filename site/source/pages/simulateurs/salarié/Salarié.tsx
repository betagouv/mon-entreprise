import { Trans, useTranslation } from 'react-i18next'

import SimulateurWarning from '@/components/SimulateurWarning'
import Simulation from '@/components/Simulation'
import { Body, Link, Strong } from '@/design-system'
import { embaucherGérerSalariés } from '@/external-links/embaucherGérerSalariés'
import { nouvelEmployeur } from '@/external-links/nouvelEmployeur'
import { serviceEmployeur } from '@/external-links/serviceEmployeur'
import { usePageMetadata } from '@/hooks/usePageMetadata'
import useSimulationPublicodes from '@/hooks/useSimulationPublicodes'
import { SimulateurId } from '@/hooks/useSimulatorsMetadata'
import ExplicationsSalaire from '@/pages/simulateurs/salarié/components/Explications'
import { MessageDirigeantSASU } from '@/pages/simulateurs/salarié/components/MessageDirigeantSASU'
import { SeoExplanations } from '@/pages/simulateurs/salarié/components/SeoExplanations'
import { CODE_DU_TRAVAIL_NUMERIQUE } from '@/utils/logos'
import { EngineProvider } from '@/utils/publicodes/EngineContext'

import SimulateurPageLayout from '../SimulateurPageLayout'
import SalariéSimulationGoals from './Goals'
import { salariéMetadata } from './metadata'
import { salariéOpenGraph } from './opengraph'
import { configSalarié } from './simulationConfig'

const nextSteps = ['activité-partielle'] satisfies SimulateurId[]

export default function SalariéSimulation() {
	const metadata = usePageMetadata(salariéMetadata)
	const { isReady, engine, questions, raccourcis } = useSimulationPublicodes(
		metadata,
		configSalarié
	)

	const { t, i18n } = useTranslation()

	const externalLinks = [
		{
			url: 'https://code.travail.gouv.fr/',
			title: t(
				'pages.simulateurs.salarié.externalLinks.1.title',
				'Code du travail numérique'
			),
			description: t(
				'pages.simulateurs.salarié.externalLinks.1.description',
				'Pour toutes vos questions en droit du travail, rendez-vous sur le site Code du travail numérique.'
			),
			logo: CODE_DU_TRAVAIL_NUMERIQUE,
			ariaLabel: t(
				'pages.simulateurs.salarié.externalLinks.1.ariaLabel',
				'Visiter le site Code du travail numérique, nouvelle fenêtre.'
			),
		},
		serviceEmployeur,
		embaucherGérerSalariés,
		nouvelEmployeur,
	]

	return (
		<EngineProvider value={engine}>
			<SimulateurPageLayout
				metadata={metadata}
				openGraph={salariéOpenGraph(t, i18n.language)}
				seoExplanations={<SeoExplanations />}
				isReady={isReady}
				nextSteps={nextSteps}
				externalLinks={externalLinks}
			>
				<Simulation
					questionsPublicodes={questions}
					raccourcisPublicodes={raccourcis}
					conseillersEntreprisesVariant="recrutement"
					explanations={<ExplicationsSalaire />}
					customEndMessages={t(
						'simulation-end.hiring.text',
						'Vous pouvez maintenant concrétiser votre projet d’embauche.'
					)}
					afterQuestionsSlot={<MessageDirigeantSASU />}
				>
					<SimulateurWarning
						metadata={metadata}
						informationsComplémentaires={
							<>
								<Body>
									<Trans i18nKey="pages.simulateurs.salarié.warning.réformes">
										Le simulateur intègre les{' '}
										<Strong>mises à jour de 2026</Strong>, y compris la
										réduction générale dégressive unique (RGDU).
									</Trans>
								</Body>
								<Body>
									<Trans i18nKey="pages.simulateurs.salarié.warning.général">
										Le simulateur ne prend pour l’instant pas en compte les
										accords et conventions collectives, ni la myriade d’aides
										aux entreprises. Trouvez votre convention collective{' '}
										<Link
											href="https://code.travail.gouv.fr/outils/convention-collective#entreprise"
											aria-label="ici, trouvez votre convention collective sur code.travail.gouv.fr, nouvelle fenêtre"
										>
											ici
										</Link>
										, et explorez les aides sur&nbsp;
										<Link
											href="https://www.aides-entreprises.fr"
											aria-label="aides-entreprises.fr, nouvelle fenêtre"
										>
											aides-entreprises.fr
										</Link>
										.
									</Trans>
								</Body>
							</>
						}
					/>
					<SalariéSimulationGoals />
				</Simulation>
			</SimulateurPageLayout>
		</EngineProvider>
	)
}
