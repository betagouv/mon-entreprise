import { Trans, useTranslation } from 'react-i18next'

import SimulateurWarning from '@/components/SimulateurWarning'
import Simulation from '@/components/Simulation'
import { Body, Emoji } from '@/design-system'
import { embaucherGérerSalariés } from '@/external-links/embaucherGérerSalariés'
import { nouvelEmployeur } from '@/external-links/nouvelEmployeur'
import { serviceEmployeur } from '@/external-links/serviceEmployeur'
import { usePageMetadata } from '@/hooks/usePageMetadata'
import useSimulationPublicodes from '@/hooks/useSimulationPublicodes'
import { SimulateurId } from '@/hooks/useSimulatorsMetadata'
import { URSSAF } from '@/utils/logos'
import { EngineProvider } from '@/utils/publicodes/EngineContext'

import SimulateurPageLayout from '../SimulateurPageLayout'
import LodeomSimulationGoals from './Goals'
import { lodeomMetadata } from './metadata'
import { SeoExplanations } from './SeoExplanations'
import { configLodeom } from './simulationConfig'

const nextSteps = ['salarié'] satisfies SimulateurId[]

export default function LodeomSimulation() {
	const metadata = usePageMetadata(lodeomMetadata)
	const { isReady, engine, questions, raccourcis } = useSimulationPublicodes(
		metadata,
		configLodeom
	)
	const { t } = useTranslation()

	const externalLinks = [
		{
			url: 'https://www.urssaf.fr/accueil/employeur/beneficier-exonerations/exonerations-zonees/exoneration-lodeom.html',
			title: t(
				'pages.simulateurs.lodeom.externalLinks.1.title',
				'Exonération Lodéom'
			),
			description: t(
				'pages.simulateurs.lodeom.externalLinks.1.description',
				'L’Urssaf met à votre disposition une fiche détaillée sur l’exonération Lodeom : conditions, cumul, calcul, déclaration…'
			),
			logo: URSSAF,
		},
		serviceEmployeur,
		embaucherGérerSalariés,
		nouvelEmployeur,
	]

	return (
		<EngineProvider value={engine}>
			<SimulateurPageLayout
				metadata={metadata}
				isReady={isReady}
				nextSteps={nextSteps}
				externalLinks={externalLinks}
				seoExplanations={<SeoExplanations />}
			>
				<Simulation
					questionsPublicodes={questions}
					raccourcisPublicodes={raccourcis}
					avecSimulationPrécédente={false}
					avecBoutonPartage={false}
				>
					<SimulateurWarning
						metadata={metadata}
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
