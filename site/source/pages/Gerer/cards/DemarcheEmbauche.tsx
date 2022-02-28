import { SitePathsContext } from '@/components/utils/SitePathsContext'
import { Article } from '@/design-system/card'
import { useContext } from 'react'
import { Trans, useTranslation } from 'react-i18next'

export function DemarcheEmbaucheCard() {
	const sitePaths = useContext(SitePathsContext)
	const { t } = useTranslation()
	return (
		<Article
			title={t(
				'gérer.ressources.embaucher.title',
				'Découvrir les démarches d’embauche '
			)}
			ctaLabel={t(
				'gérer.ressources.embaucher.cta',
				'Voir la liste des démarches'
			)}
			to={sitePaths.gérer.embaucher}
		>
			<Trans i18nKey="gérer.ressources.embaucher.body">
				La liste des choses à faire pour être sûr de ne rien oublier lors de
				l’embauche d’un nouveau salarié
			</Trans>
		</Article>
	)
}
