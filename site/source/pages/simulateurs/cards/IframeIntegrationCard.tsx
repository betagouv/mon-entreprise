import { Trans, useTranslation } from 'react-i18next'

import { Article, Emoji } from '@/design-system'

type IframeIntegrationCardProps = {
	sitePaths: { développeur: { iframe: string } }
	iframePath: string
}

export function IframeIntegrationCard({
	sitePaths,
	iframePath,
}: IframeIntegrationCardProps) {
	const { t } = useTranslation()

	return (
		<Article
			icon={<Emoji emoji="👩‍🔧" />}
			title={
				<Trans i18nKey="nextSteps.integration-iframe.title">
					Intégrer le module web
				</Trans>
			}
			ctaLabel={t('nextSteps.integration-iframe.cta', 'Voir la documentation')}
			aria-label={t(
				'nextSteps.integration-iframe.aria-label',
				'Intégrer le module web, Voir la documentation'
			)}
			to={{
				pathname: sitePaths.développeur.iframe,
				search: `?module=${iframePath}`,
			}}
		>
			<Trans i18nKey="nextSteps.integration-iframe.body">
				Découvrez comment ajouter ce simulateur sur votre site internet en un
				clic, via un script clé en main.
			</Trans>
		</Article>
	)
}
