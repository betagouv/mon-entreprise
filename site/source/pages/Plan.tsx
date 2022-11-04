import { H1 } from '@/design-system/typography/heading'
import { Link } from '@/design-system/typography/link'
import { Li, Ul } from '@/design-system/typography/list'
import { useSitePaths } from '@/sitePaths'
import { Trans } from 'react-i18next'
import { TrackPage } from '../ATInternetTracking'
import Meta from '../components/utils/Meta'

export default function Plan() {
	const { absoluteSitePaths } = useSitePaths()

	return (
		<Trans i18nKey="pages.plan-du-site">
			<H1>Plan du site</H1>
			<Meta
				page="plan-du-site"
				title="Plan du site"
				description="Page détaillant l'arborescence du site Mon-Entreprise."
			/>
			<TrackPage chapter1="navigation" name="plan-du-site" />
			<ul>
				<Li as="h2">
					<Link to={absoluteSitePaths.index}>Page d'accueil</Link>
				</Li>
				<Li as="h2">
					<Link to={absoluteSitePaths.créer.index}>Créer une entreprise</Link>
					<Ul>
						<Li>
							<Link to={absoluteSitePaths.créer.après}>Après la création</Link>
						</Li>
						<Li>
							<Link to={absoluteSitePaths.créer.guideStatut.index}>
								Choix du statut juridique
							</Link>
						</Li>
					</Ul>
				</Li>

				<Li as="h2">
					<Link to={absoluteSitePaths.gérer.index}>Gérer mon activité</Link>
				</Li>
				<Li as="h2">
					<Link to={absoluteSitePaths.gérer.index}>Gérer mon activité</Link>
				</Li>
			</ul>
		</Trans>
	)
}
