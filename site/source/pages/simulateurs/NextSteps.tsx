import { ReactNode } from 'react'
import { Trans } from 'react-i18next'
import { useSelector } from 'react-redux'

import { Grid, H2, Spacing, Ul } from '@/design-system'
import { SimulateurId } from '@/hooks/useSimulatorsData'
import { AnnuaireEntreprises } from '@/pages/assistants/pour-mon-entreprise/AnnuaireEntreprises'
import { IframeIntegrationCard } from '@/pages/simulateurs/cards/IframeIntegrationCard'
import { SimulatorRessourceCard } from '@/pages/simulateurs/cards/SimulatorRessourceCard'
import { companySirenSelector } from '@/store/selectors/company/companySiren.selector'

import { ExternalLink } from './_configs/types'
import ExternalLinkCard from './cards/ExternalLinkCard'

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
	const existingCompany = !!useSelector(companySirenSelector)

	if (!simulateur && !nextSteps && !externalLinks) {
		return null
	}

	return (
		<section className="print-hidden">
			<H2>
				<Trans i18nKey="common.useful-resources">Ressources utiles</Trans>
			</H2>
			<Grid as={Ul} container spacing={3}>
				{existingCompany && (
					<GridItem>
						<AnnuaireEntreprises />
					</GridItem>
				)}

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

type GridItemProps = {
	children: ReactNode
}
const GridItem = ({ children }: GridItemProps) => (
	<Grid as="li" item xs={12} sm={6} lg={4}>
		{children}
	</Grid>
)
