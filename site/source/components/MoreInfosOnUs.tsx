import { SmallCard } from '@/design-system/card'
import { Grid } from '@/design-system/layout'
import { H2 } from '@/design-system/typography/heading'
import { useSitePaths } from '@/sitePaths'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'
import { icons } from './ui/SocialIcon'
import Emoji from './utils/Emoji'

export default function MoreInfosOnUs() {
	const { pathname } = useLocation()
	const { absoluteSitePaths } = useSitePaths()
	const { language } = useTranslation().i18n

	if (language !== 'fr') {
		return null
	}

	return (
		<>
			<H2>Plus d'infos sur mon-entreprise</H2>
			<Grid container spacing={2}>
				{!pathname.startsWith(absoluteSitePaths.nouveautés) && (
					<Grid item xs={12} sm={6} md={4}>
						<SmallCard
							icon={<Emoji emoji={'✨'} />}
							title={<h3>Les nouveautés</h3>}
							to={absoluteSitePaths.nouveautés}
						>
							Qu'avons-nous mis en production ces derniers mois ?
						</SmallCard>
					</Grid>
				)}
				{!pathname.startsWith(absoluteSitePaths.stats) && (
					<Grid item xs={12} sm={6} md={4}>
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
					<Grid item xs={12} sm={6} md={4}>
						<SmallCard
							icon={<Emoji emoji="💶" />}
							to={absoluteSitePaths.budget}
							title={<h3>Le budget</h3>}
						>
							Quelles sont nos ressources et comment sont-elles employées ?
						</SmallCard>
					</Grid>
				)}
				<Grid item xs={12} sm={6} md={4}>
					<SmallCard
						icon={
							<svg
								viewBox="15 15 34 34"
								style={{
									width: '3rem',
									height: '3rem',
									margin: 0,
								}}
								aria-hidden="true"
								role="img"
							>
								<g>
									<path d={icons.github.icon} />
								</g>
							</svg>
						}
						href="https://github.com/betagouv/mon-entreprise"
						title={<h3>Le code source</h3>}
					>
						Nos travaux sont ouverts et libres de droit, ça se passe sur GitHub
					</SmallCard>
				</Grid>
			</Grid>
		</>
	)
}
