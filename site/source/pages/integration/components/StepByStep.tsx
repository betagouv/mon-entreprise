import { Trans } from 'react-i18next'

import { Body, Li, Link, Strong } from '@/design-system/index'
import { useSitePaths } from '@/sitePaths'

export default function StepByStep() {
	return (
		<Trans i18nKey="pages.développeur.components.StepByStep">
			<Li>
				<Body>
					<Strong>
						Choisir le simulateur en fonction du calcul qui nous intéresse
					</Strong>
					<br />
					Par exemple le{' '}
					<Link
						to={useSitePaths().absoluteSitePaths.simulateurs.salarie}
						aria-label="simulateur salarie, accéder au simulateur salarie"
					>
						simulateur salarie
					</Link>{' '}
					pour calculer un net à partir du brut.
				</Body>
			</Li>
			<Li>
				<Body>
					<Strong>
						Effectuer une simulation avec les données que l'on souhaite
						réutiliser
					</Strong>
					<br />
					Par exemple{' '}
					<Link
						to={{
							pathname: useSitePaths().absoluteSitePaths.simulateurs.salarie,
							search:
								'salaire-brut=3400%E2%82%AC%2Fmois&salari%C3%A9+.+contrat=%27CDI%27&salari%C3%A9+.+contrat+.+statut+cadre=oui&salari%C3%A9+.+r%C3%A9mun%C3%A9ration+.+frais+professionnels+.+titres-restaurant=oui',
						}}
						aria-label="un cadre à 3400 € brut avec des titres-restaurants, accéder au simulateur salarie avec les données pré-remplies pour un cadre à 3400 € brut avec des titres-restaurants"
					>
						un cadre à 3400 € brut avec des titres-restaurants
					</Link>
					.
				</Body>
			</Li>
			<Li>
				<Body>
					<Strong>
						Aller sur la page de documentation de la donnée à calculer
					</Strong>
					<br />
					Par exemple en cliquant sur « Salaire net » dans le simulateur, ou en
					recherchant « Salaire net » dans la recherche en haut à droite.
				</Body>
			</Li>
		</Trans>
	)
}
