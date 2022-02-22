import { SitePathsContext } from '~/components/utils/SitePathsContext'
import { Article } from '~/design-system/card'
import { useContext } from 'react'
import { Trans, useTranslation } from 'react-i18next'

export function MobiliteCard() {
	const sitePaths = useContext(SitePathsContext)
	const { t } = useTranslation()
	return (
		<Article
			title={t(
				'gérer.ressources.export.title',
				'Exporter son activité en Europe'
			)}
			ctaLabel={t('gérer.ressources.export.cta', 'Remplir le formulaire')}
			to={sitePaths.gérer.formulaireMobilité}
		>
			<Trans i18nKey="gérer.ressources.export.body">
				Le formulaire pour effectuer une demande de mobilité internationale
				(détachement ou pluriactivité)
			</Trans>
		</Article>
	)
}
