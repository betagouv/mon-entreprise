import { SitePathsContext } from '~/components/utils/SitePathsContext'
import { Article } from '~/design-system/card'
import { useContext } from 'react'
import { Trans, useTranslation } from 'react-i18next'

export function SecuriteSocialeCard() {
	const sitePaths = useContext(SitePathsContext)
	const { t } = useTranslation()

	return (
		<Article
			title={
				<h3>
					<Trans i18nKey="gérer.ressources.sécuritéSociale.title">
						Comprendre la sécurité sociale
					</Trans>
				</h3>
			}
			ctaLabel={t('gérer.ressources.sécuritéSociale.cta', 'Lire le guide')}
			to={sitePaths.gérer.sécuritéSociale}
		>
			<Trans i18nKey="gérer.ressources.sécuritéSociale.body">
				A quoi servent les cotisations sociales ? Le point sur le système de
				protection sociale dont bénéficient tous les travailleurs en France.
			</Trans>
		</Article>
	)
}
