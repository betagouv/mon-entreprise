import { Article } from '@/design-system/card'
import { useSitePaths } from '@/sitePaths'
import { Trans, useTranslation } from 'react-i18next'

export function DemarcheEmbaucheCard() {
	const { absoluteSitePaths } = useSitePaths()
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
			to={absoluteSitePaths.gérer.embaucher}
		>
			<Trans i18nKey="gérer.ressources.embaucher.body">
				La liste des choses à faire pour être sûr de ne rien oublier lors de
				l’embauche d’un nouveau salarié
			</Trans>
		</Article>
	)
}
