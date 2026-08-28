import { Trans } from 'react-i18next'

import { Body, Li, Link, Strong } from '@/design-system'
import { useSitePaths } from '@/sitePaths'

export default function ÉtapesPourReproduireUnCalcul() {
	return (
		<Trans i18nKey="pages.développeur.components.StepByStep">
			<Li>
				<Body>
					<Strong>
						Choisir le simulateur en fonction du calcul qui nous intéresse
					</Strong>
					<br />
					Par exemple le{' '}
					<Link to={useSitePaths().absoluteSitePaths.simulateurs.salarié}>
						simulateur salarié
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
					Par exemple un ou une{' '}
					<Link
						to={{
							pathname: useSitePaths().absoluteSitePaths.simulateurs.salarié,
							search:
								'salari%C3%A9+.+contrat=%27CDI%27&salari%C3%A9+.+contrat+.+salaire+brut=3400+%E2%82%AC%2Fmois&salari%C3%A9+.+contrat+.+statut+cadre=oui&salari%C3%A9+.+r%C3%A9mun%C3%A9ration+.+frais+professionnels+.+titres-restaurant=oui',
						}}
						aria-label="un cadre à 3400 € brut avec des titres-restaurants, accéder au simulateur salarié avec les données pré-remplies"
					>
						cadre à 3&nbsp;400&nbsp;€ brut avec des titres-restaurants
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
					Par exemple en cliquant sur «&nbsp;Salaire net&nbsp;» dans le
					simulateur, ou en recherchant «&nbsp;Salaire net&nbsp;» dans la
					recherche en haut à droite.
				</Body>
			</Li>
		</Trans>
	)
}
