import { useTranslation } from 'react-i18next'

import {
	Emoji,
	GithubIcon,
	Grid,
	H2,
	SmallCard,
	Spacing,
	Ul,
} from '@/design-system'
import { useNavigation } from '@/lib/navigation'
import { useSitePaths } from '@/sitePaths'

export default function MoreInfosOnUs() {
	const { currentPath } = useNavigation()
	const { absoluteSitePaths } = useSitePaths()
	const { t, i18n } = useTranslation()

	if (i18n.language !== 'fr') {
		return null
	}

	return (
		<>
			<H2>Plus d'informations sur mon-entreprise</H2>
			<Grid as={Ul} container spacing={2}>
				{!currentPath.startsWith(absoluteSitePaths.nouveautés.index) && (
					<Grid as="li" item xs={12} sm={6} md={4}>
						<SmallCard
							icon={<Emoji emoji={'✨'} />}
							title={t(
								'components.more-infos-on-us.nouveautés',
								'Les nouveautés'
							)}
							to={absoluteSitePaths.nouveautés.index}
						>
							Qu'avons-nous mis en production ces derniers mois ?
						</SmallCard>
					</Grid>
				)}
				{!currentPath.startsWith(absoluteSitePaths.stats) && (
					<Grid as="li" item xs={12} sm={6} md={4}>
						<SmallCard
							icon={<Emoji emoji="📊" />}
							to={absoluteSitePaths.stats}
							title={t(
								'components.more-infos-on-us.statistiques',
								'Les statistiques'
							)}
						>
							Quel est notre impact ?
						</SmallCard>
					</Grid>
				)}
				{!currentPath.startsWith(absoluteSitePaths.budget) && (
					<Grid as="li" item xs={12} sm={6} md={4}>
						<SmallCard
							icon={<Emoji emoji="💶" />}
							to={absoluteSitePaths.budget}
							title={t('components.more-infos-on-us.budget', 'Le budget')}
						>
							Quelles sont nos ressources et comment sont-elles employées ?
						</SmallCard>
					</Grid>
				)}
				<Grid as="li" item xs={12} sm={6} md={4}>
					<SmallCard
						icon={<GithubIcon style={{ width: '2rem', height: '2rem' }} />}
						href="https://github.com/betagouv/mon-entreprise"
						title={t('components.more-infos-on-us.code-source', ' code source')}
						aria-label="Voir le code source, nouvelle fenêtre"
					>
						Nos travaux sont ouverts et libres de droit, ça se passe sur GitHub
					</SmallCard>
				</Grid>
			</Grid>
			<Spacing md />
		</>
	)
}
