import Emoji from 'Components/utils/Emoji'
import { Card } from 'DesignSystem/card'
import { Body } from 'DesignSystem/typography/paragraphs'
import { Trans, useTranslation } from 'react-i18next'

type IframeIntegrationCardProps = {
	sitePaths: { integration: { iframe: string } }
	iframePath: string
}

export function IframeIntegrationCard({
	sitePaths,
	iframePath,
}: IframeIntegrationCardProps) {
	const { t } = useTranslation()
	return (
		<Card
			title={t('nextSteps.integration-iframe.title', 'Intégrer le module web')}
			icon={<Emoji emoji="👩‍🔧" />}
			callToAction={{
				to: {
					pathname: sitePaths.integration.iframe,
					search: `?module=${iframePath}`,
				},
				label: t('nextSteps.integration-iframe.cta', 'Voir la documentation'),
			}}
		>
			<Body>
				<Trans i18nKey="nextSteps.integration-iframe.body">
					Decouvrez comment ajouter ce simulateur sur votre site internet en un
					clic via un script clé en main.
				</Trans>
			</Body>
		</Card>
	)
}
