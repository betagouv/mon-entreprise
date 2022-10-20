import { Strong } from '@/design-system/typography'
import { Link } from '@/design-system/typography/link'
import { Li } from '@/design-system/typography/list'
import { useSitePaths } from '@/sitePaths'
import { Trans } from 'react-i18next'

export default function StepByStep() {
	return (
		<Trans i18nKey="pages.développeur.components.StepByStep">
			<Li>
				<Strong>
					Choisir le simulateur en fonction du calcul qui nous intéresse
				</Strong>
				<br />
				Par exemple le{' '}
				<Link
					to={useSitePaths().absoluteSitePaths.simulateurs.salarié}
					aria-label="simulateur salarié, accéder au simulateur salarié"
				>
					simulateur salarié
				</Link>{' '}
				pour calculer un net à partir du brut.
			</Li>
			<Li>
				<Strong>
					Effectuer une simulation avec les données que l'on souhaite réutiliser
				</Strong>
				<br />
				Par exemple{' '}
				<Link
					to={{
						pathname: useSitePaths().absoluteSitePaths.simulateurs.salarié,
						search:
							'salaire-brut=3400%E2%82%AC%2Fmois&salari%C3%A9+.+contrat=%27CDI%27&salari%C3%A9+.+contrat+.+statut+cadre=oui&salari%C3%A9+.+r%C3%A9mun%C3%A9ration+.+frais+professionnels+.+titres-restaurant=oui',
					}}
					aria-label="un cadre à 3400 € brut avec des titres-restaurants, accéder au simulateur salarié avec les données pré-remplies pour un cadre à 3400 € brut avec des titres-restaurants"
				>
					un cadre à 3400 € brut avec des titres-restaurants
				</Link>
				.
			</Li>
			<Li>
				<Strong>
					Aller sur la page de documentation de la donnée à calculer
				</Strong>
				<br />
				Par exemple en cliquant sur « Salaire net » dans le simulateur, ou en
				recherchant « Salaire net » dans la recherche en haut à droite.
			</Li>
		</Trans>
	)
}
