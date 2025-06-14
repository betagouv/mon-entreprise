import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'

import {
	Emoji,
	GithubIcon,
	Grid,
	H2,
	SmallCard,
	Spacing,
} from '@/design-system'
import { useSitePaths } from '@/sitePaths'

export default function MoreInfosOnUs() {
	const { pathname } = useLocation()
	const { absoluteSitePaths } = useSitePaths()
	const { language } = useTranslation().i18n

	if (language !== 'fr') {
		return null
	}

	return (
		<>
			<H2>Plus d'informations sur mon-entreprise</H2>
			<Grid container spacing={2} role="list">
				{!pathname.startsWith(absoluteSitePaths.nouveautés.index) && (
					<Grid item xs={12} sm={6} md={4} role="listitem">
						<SmallCard
							icon={<Emoji emoji={'✨'} />}
							title={<h3>Les nouveautés</h3>}
							to={absoluteSitePaths.nouveautés.index}
						>
							Qu'avons-nous mis en production ces derniers mois ?
						</SmallCard>
					</Grid>
				)}
				{!pathname.startsWith(absoluteSitePaths.stats) && (
					<Grid item xs={12} sm={6} md={4} role="listitem">
						<SmallCard
							icon={<Emoji emoji="📊" />}
							to={absoluteSitePaths.stats}
							title={<h3>Les statistiques</h3>}
						>
							Quel est notre impact ?
						</SmallCard>
					</Grid>
				)}
				{!pathname.startsWith(absoluteSitePaths.budget) && (
					<Grid item xs={12} sm={6} md={4} role="listitem">
						<SmallCard
							icon={<Emoji emoji="💶" />}
							to={absoluteSitePaths.budget}
							title={<h3>Le budget</h3>}
						>
							Quelles sont nos ressources et comment sont-elles employées ?
						</SmallCard>
					</Grid>
				)}
				<Grid item xs={12} sm={6} md={4} role="listitem">
					<SmallCard
						icon={<GithubIcon style={{ width: '2rem', height: '2rem' }} />}
						href="https://github.com/betagouv/mon-entreprise"
						title={<h3>Le code source</h3>}
					>
						Nos travaux sont ouverts et libres de droit, ça se passe sur GitHub
					</SmallCard>
				</Grid>
			</Grid>
			<Spacing md />
		</>
	)
}
