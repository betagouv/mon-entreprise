import { SitePathsContext } from 'Components/utils/withSitePaths'
import React, { useContext } from 'react'
import emoji from 'react-easy-emoji'
import { Helmet } from 'react-helmet'
import { Trans, useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

export const simulateursDetails = {
	'/salarié': {
		name: 'Salarié',
		description:
			"Calculer le salaire net, brut, ou total d'un salarié, stagiaire,ou assimilé",
		icone: '🤝',
		keySitePaths: 'salarié',
		keyTrad: 'simulateurs.accueil.salarié'
	},
	'/auto-entrepreneur': {
		name: 'Auto-entrepreneur',
		description:
			"Calculer le revenu (ou le chiffre d'affaires) d'un auto-entrepreneur",
		icone: '🚶‍♂️',
		keySitePaths: 'auto-entrepreneur',
		keyTrad: 'simulateurs.accueil.auto'
	},
	'/artiste-auteur': {
		name: 'Artiste-auteur',
		description: "Estimer les cotisations sociales d'un artiste ou auteur",
		icone: '👩‍🎨',
		keySitePaths: 'artiste-auteur',
		keyTrad: 'simulateurs.accueil.artiste-auteur'
	},
	'/indépendant': {
		name: 'Indépendant',
		description:
			"Calculer le revenu d'un dirigeant de EURL, EI, ou SARL majoritaire",
		icone: '👩‍🔧',
		keySitePaths: 'indépendant',
		keyTrad: 'simulateurs.accueil.indépendant'
	},
	'/assimilé-salarié': {
		name: 'Assimilé salarié',
		description:
			"Calculer le revenu d'un dirigeant de SAS, SASU ou SARL minoritaire",
		icone: '☂️',
		keySitePaths: 'assimilé-salarié',
		keyTrad: 'simulateurs.accueil.assimilé'
	},
	'/comparaison-régimes-sociaux': {
		name: 'Comparaison statuts',
		description:
			'Simulez les différences entre les régimes (cotisations,retraite, maternité, maladie, etc.)',
		icone: '📊',
		keySitePaths: 'comparaison',
		keyTrad: 'simulateurs.accueil.comparaison'
	},
	'/coronavirus': {
		name: 'Coronavirus',
		description: '',
		icone: '👨‍🔬',
		keySitePaths: '',
		keyTrad: ''
	}
}

export default function Simulateurs() {
	const sitePaths = useContext(SitePathsContext)
	const { t, i18n } = useTranslation()
	const titre = t('simulateurs.accueil.titre', 'Simulateurs disponibles')
	return (
		<>
			<Helmet>
				<title>{titre}</title>
			</Helmet>

			<section className="ui__ full-width light-bg">
				<h1 css="min-width: 100%; text-align: center">{titre}</h1>
				<div
					className="ui__ center-flex"
					// Il y a actuellement 6 simulateurs affichés, c'est plus beau
					// d'afficher une grille de 3x2 sur les écrans larges.
					//
					// TODO: on pourrait généraliser cette logique sur toutes les grilles
					// avec des blocs centrés pour éviter d'avoir 1 seul élements sur la
					// dernière ligne.
					style={{ maxWidth: 1100, margin: 'auto' }}
				>
					{Object.keys(simulateursDetails).map(simulator => {
						if (
							[
								'/assimilé-salarié',
								'/indépendant',
								'/auto-entrepreneur',
								'/salarié',
								'/artiste-auteur',
								'/comparaison-régimes-sociaux'
							].includes(simulator)
						) {
							return (
								<Link
									className="ui__ interactive card box"
									key={simulator}
									to={{
										state: { fromSimulateurs: true },
										pathname:
											sitePaths.simulateurs[
												simulateursDetails[simulator].keySitePaths
											]
									}}
								>
									<div className="ui__ big box-icon">
										{emoji(simulateursDetails[simulator].icone)}
									</div>
									<Trans i18nKey={simulateursDetails[simulator].keyTrad}>
										<h3>{simulateursDetails[simulator].name}</h3>
										<p className="ui__ notice" css="flex: 1">
											{simulateursDetails[simulator].description}
										</p>
									</Trans>
								</Link>
							)
						}
					})}
				</div>
			</section>
			<section>
				<Trans i18nKey="simulateurs.accueil.description">
					<p>Tous les simulateurs sur ce site sont :</p>
					<ul>
						<li>
							<strong>Maintenus à jour</strong> avec les dernières évolutions
							législatives
						</li>
						<li>
							<strong>Améliorés en continu</strong> afin d'augmenter le nombre
							de dispositifs pris en compte
						</li>
						<li>
							Développés en <strong>partenariat avec l'Urssaf</strong>
						</li>
					</ul>
				</Trans>
			</section>
		</>
	)
}
