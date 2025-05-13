import { ReactNode } from 'react'
import { Trans } from 'react-i18next'

import { WhenAlreadyDefined } from '@/components/EngineValue/WhenAlreadyDefined'
import { useEngine } from '@/components/utils/EngineContext'
import { Grid, Spacing } from '@/design-system/layout'
import { H2 } from '@/design-system/typography/heading'
import { MergedSimulatorDataValues } from '@/hooks/useCurrentSimulatorData'
import { IframeIntegrationCard } from '@/pages/simulateurs/cards/IframeIntegrationCard'
import { SimulatorRessourceCard } from '@/pages/simulateurs/cards/SimulatorRessourceCard'
import { useSitePaths } from '@/sitePaths'

import { AnnuaireEntreprises } from '../assistants/pour-mon-entreprise/AnnuaireEntreprises'
import { ExternalLink } from './_configs/types'
import ExternalLinkCard from './cards/ExternalLinkCard'

interface NextStepsProps {
	iframePath?: MergedSimulatorDataValues['iframePath']
	nextSteps: MergedSimulatorDataValues['nextSteps']
	externalLinks: MergedSimulatorDataValues['externalLinks']
}

export default function NextSteps({
	iframePath,
	nextSteps,
	externalLinks,
}: NextStepsProps) {
	const { absoluteSitePaths } = useSitePaths()
	const engine = useEngine()

	const relevantExternalLinks = externalLinks?.filter(
		({ associatedRule }: ExternalLink) =>
			!associatedRule || engine.evaluate(associatedRule).nodeValue
	)

	if (!iframePath && !nextSteps && !externalLinks) {
		return null
	}

	return (
		<section className="print-hidden">
			<H2>
				<Trans i18nKey="common.useful-resources">Ressources utiles</Trans>
			</H2>
			<Grid container spacing={3} role="list">
				<WhenAlreadyDefined dottedName="entreprise . SIREN">
					<GridItem>
						<AnnuaireEntreprises />
					</GridItem>
				</WhenAlreadyDefined>

				{nextSteps &&
					nextSteps.map((simulatorId) => (
						<GridItem key={simulatorId}>
							<SimulatorRessourceCard simulatorId={simulatorId} />
						</GridItem>
					))}

				{relevantExternalLinks &&
					relevantExternalLinks.map((externalLink, index) => (
						<GridItem key={index}>
							<ExternalLinkCard externalLink={externalLink} />
						</GridItem>
					))}

				{iframePath && (
					<GridItem>
						<IframeIntegrationCard
							iframePath={iframePath}
							sitePaths={absoluteSitePaths}
						/>
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
	<Grid item xs={12} sm={6} lg={4} role="listitem">
		{children}
	</Grid>
)
