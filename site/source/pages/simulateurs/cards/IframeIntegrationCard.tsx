import { useTranslation } from 'react-i18next'

import { Article, Emoji } from '@/design-system'
import { MergedSimulatorMetadata } from '@/hooks/useSimulatorsMetadata'
import { useSitePaths } from '@/sitePaths'

type IframeIntegrationCardProps = {
	simulateur: MergedSimulatorMetadata['id']
}

export function IframeIntegrationCard({
	simulateur,
}: IframeIntegrationCardProps) {
	const { absoluteSitePaths } = useSitePaths()
	const { t } = useTranslation()

	return (
		<Article
			icon={<Emoji emoji="👩‍🔧" />}
			ctaLabel={t('nextSteps.integration-iframe.cta', 'Voir la documentation')}
			aria-label={t(
				'nextSteps.integration-iframe.aria-label',
				'Intégrer le module web, Voir la documentation'
			)}
			to={{
				pathname: absoluteSitePaths.développeur.iframe,
				search: `?simulateur=${simulateur}`,
			}}
		>
			{t(
				'nextSteps.integration-iframe.body',
				'Découvrez comment ajouter ce simulateur sur votre site internet en un clic, via un script clé en main.'
			)}
		</Article>
	)
}
