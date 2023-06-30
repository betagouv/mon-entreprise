import { useLocation } from 'react-router-dom'

import { Button } from '@/design-system/buttons'
import { Emoji } from '@/design-system/emoji'
import { Container, Grid, Spacing } from '@/design-system/layout'
import { H3 } from '@/design-system/typography/heading'
import { Intro } from '@/design-system/typography/paragraphs'
import { useSitePaths } from '@/sitePaths'

export default function Résultat() {
	const { absoluteSitePaths } = useSitePaths()
	const location = useLocation()

	const statut = Object.entries(
		absoluteSitePaths.assistants['choix-du-statut'].résultat
	).find(([, path]) => location.pathname === path)?.[0]

	return (
		<>
			<H3 as="h2">
				<Emoji emoji="🎉" /> Félicitations, vous allez créer une {statut} !
			</H3>
			<Intro>
				Votre choix est fait. Voici venu le temps de rassembler toutes les
				informations nécessaires à la création de votre entreprise. Voici
				quelques pistes.
			</Intro>

			<Button
				color="secondary"
				light
				to={absoluteSitePaths.assistants['choix-du-statut'].index}
			>
				<span aria-hidden>↻</span> Recommencer le guide
			</Button>
			<Spacing md />
			<Container
				backgroundColor={(theme) =>
					theme.darkMode
						? theme.colors.extended.dark[700]
						: theme.colors.bases.primary[100]
				}
				css={`
					padding: 2rem 0;
				`}
			>
				<Grid spacing={3} container>
					<Grid item lg={6} sm={12}></Grid>
				</Grid>
			</Container>
		</>
	)
}
