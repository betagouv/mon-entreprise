import { Trans, useTranslation } from 'react-i18next'

import { Body, Code, Li, Link, Ol, Strong } from '@/design-system'
import { useSitePaths } from '@/sitePaths'

type Props = {
	mode: 'api' | 'npm'
}

export default function ÉtapesPourReproduireUnCalcul({ mode }: Props) {
	const { t } = useTranslation()

	return (
		<Ol>
			<Li>
				<Body>
					<Trans i18nKey="pages.développeur.components.étapes-pour-reproduire-un-calcul.1">
						<Strong>
							Choisir le simulateur en fonction du calcul qui nous intéresse
						</Strong>
						<br />
						Par exemple, le{' '}
						<Link to={useSitePaths().absoluteSitePaths.simulateurs.salarié}>
							simulateur salarié
						</Link>{' '}
						pour calculer un net à partir du brut.
					</Trans>
				</Body>
			</Li>
			<Li>
				<Body>
					<Trans i18nKey="pages.développeur.components.étapes-pour-reproduire-un-calcul.2">
						<Strong>
							Effectuer une simulation avec les données que l'on souhaite
							réutiliser
						</Strong>
						<br />
						Par exemple, un ou une{' '}
						<Link
							to={{
								pathname: useSitePaths().absoluteSitePaths.simulateurs.salarié,
								search:
									'salari%C3%A9+.+contrat=%27CDI%27&salari%C3%A9+.+contrat+.+salaire+brut=3400+%E2%82%AC%2Fmois&salari%C3%A9+.+contrat+.+statut+cadre=oui&salari%C3%A9+.+r%C3%A9mun%C3%A9ration+.+frais+professionnels+.+titres-restaurant=oui',
							}}
							aria-label={t(
								'pages.développeur.components.étapes-pour-reproduire-un-calcul.aria-label.exemple-simulation',
								'un cadre à 3400 € brut avec des titres-restaurants, accéder au simulateur salarié avec les données pré-remplies'
							)}
						>
							cadre à 3&nbsp;400&nbsp;€ brut avec des titres-restaurants
						</Link>
						.
					</Trans>
				</Body>
			</Li>
			<Li>
				<Body>
					<Trans i18nKey="pages.développeur.components.étapes-pour-reproduire-un-calcul.3">
						<Strong>
							Aller sur la page de documentation de la donnée à calculer
						</Strong>
						<br />
						Par exemple, en cliquant sur «&nbsp;Salaire net&nbsp;» dans le
						simulateur.
					</Trans>
				</Body>
			</Li>
			{mode === 'npm' && (
				<Li>
					<Body>
						<Trans i18nKey="pages.développeur.components.étapes-pour-reproduire-un-calcul.4-npm">
							<Strong>
								Copiez l'extrait de code personnalisé et intégrez-le dans votre
								application
							</Strong>
							<br />
							Vous le trouverez en cliquant sur la section «&nbsp;Réutiliser ce
							calcul&nbsp;».
						</Trans>
					</Body>
				</Li>
			)}
			{mode === 'api' && (
				<Li>
					<Body>
						<Trans i18nKey="pages.développeur.components.étapes-pour-reproduire-un-calcul.4-api">
							<Strong>
								Dans la section «&nbsp;Réutiliser ce calcul&nbsp;», vous
								trouverez la requête API à copier-coller sous forme d'appel{' '}
								<Code>curl</Code> ou de <Code>fetch</Code> JavaScript
							</Strong>
							<br /> Vous pouvez également retrouver le nom de la règle et la
							situation à utiliser pour effectuer le calcul dans la section
							«&nbsp;Règle et situation&nbsp;».
						</Trans>
					</Body>
				</Li>
			)}
			<Li>
				<Body>
					<Trans i18nKey="pages.développeur.components.étapes-pour-reproduire-un-calcul.5">
						<Strong>
							(facultatif) Modifiez les valeurs de la situation pour paramétrer
							le calcul selon vos besoins
						</Strong>
						<br />
						Vous pouvez modifier sans hésiter les valeurs de la situation. Ces
						dernières acceptent n'importe quelle{' '}
						<Link
							href="https://publi.codes/docs/manuel/principe-de-base"
							aria-label={t(
								'pages.développeur.components.étapes-pour-reproduire-un-calcul.aria-label.expression-publicodes',
								'expression ou objet publicodes, en savoir plus, nouvelle fenêtre'
							)}
						>
							expression ou objet Publicodes
						</Link>
						.
					</Trans>
				</Body>
			</Li>
		</Ol>
	)
}
