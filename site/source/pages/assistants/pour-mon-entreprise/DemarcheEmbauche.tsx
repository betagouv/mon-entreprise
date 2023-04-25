import { Trans, useTranslation } from 'react-i18next'

import { Article } from '@/design-system/card'
import { useSitePaths } from '@/sitePaths'

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
			aria-label={t(
				'gérer.ressources.embaucher.aria-label',
				"Embauche d'un salarié, Voir la liste des démarches"
			)}
			to={absoluteSitePaths.assistants.embaucher}
		>
			<Trans i18nKey="gérer.ressources.embaucher.body">
				La liste des choses à faire pour être sûr de ne rien oublier lors de
				l’embauche d’un nouveau salarié
			</Trans>
		</Article>
	)
}
