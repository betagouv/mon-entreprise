import { ReactNode } from 'react'
import { Trans } from 'react-i18next'
import { useSelector } from 'react-redux'

import BrowserOnly from '@/components/utils/BrowserOnly'
import { Grid, H2, Spacing, Ul } from '@/design-system'
import { ExternalLink } from '@/domaine/PageMetadata'
import { SimulateurId } from '@/hooks/useSimulatorsMetadata'
import { companySirenSelector } from '@/store/selectors/company/companySiren.selector'

import { AnnuaireEntreprises } from './AnnuaireEntreprises'
import ExternalLinkCard from './cards/ExternalLinkCard'
import { IframeIntegrationCard } from './cards/IframeIntegrationCard'
import { SimulatorRessourceCard } from './cards/SimulatorRessourceCard'

interface NextStepsProps {
	simulateur?: SimulateurId
	nextSteps?: SimulateurId[]
	externalLinks?: ExternalLink[]
}

export default function NextSteps({
	simulateur,
	nextSteps,
	externalLinks,
}: NextStepsProps) {
	if (!simulateur && !nextSteps && !externalLinks) {
		return null
	}

	return (
		<section className="print-hidden">
			<H2>
				<Trans i18nKey="common.useful-resources">Ressources utiles</Trans>
			</H2>
			<Grid as={Ul} container spacing={3}>
				<BrowserOnly>
					<CarteAnnuaireEntreprises />
				</BrowserOnly>

				{nextSteps &&
					nextSteps.map((simulatorId) => (
						<GridItem key={simulatorId}>
							<SimulatorRessourceCard simulatorId={simulatorId} />
						</GridItem>
					))}

				{externalLinks &&
					externalLinks.map((externalLink, index) => (
						<GridItem key={index}>
							<ExternalLinkCard externalLink={externalLink} />
						</GridItem>
					))}

				{simulateur && (
					<GridItem>
						<IframeIntegrationCard simulateur={simulateur} />
					</GridItem>
				)}
			</Grid>

			<Spacing lg />
		</section>
	)
}

// L'entreprise enregistrée est restaurée du stockage, inconnue du serveur.
const CarteAnnuaireEntreprises = () => {
	const entrepriseEnregistrée = !!useSelector(companySirenSelector)

	if (!entrepriseEnregistrée) {
		return null
	}

	return (
		<GridItem>
			<AnnuaireEntreprises />
		</GridItem>
	)
}

type GridItemProps = {
	children: ReactNode
}
const GridItem = ({ children }: GridItemProps) => (
	<Grid as="li" item xs={12} sm={6} lg={4}>
		{children}
	</Grid>
)
