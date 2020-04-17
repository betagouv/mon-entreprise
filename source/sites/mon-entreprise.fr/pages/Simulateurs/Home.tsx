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
		icone: '🤝'
	},
	'/auto-entrepreneur': {
		name: 'Auto-entrepreneur',
		description:
			"Calculer le revenu (ou le chiffre d'affaires) d'un auto-entrepreneur",
		icone: '🚶‍♂️'
	},
	'/artiste-auteur': {
		name: 'Artiste-auteur',
		description: "Estimer les cotisations sociales d'un artiste ou auteur",
		icone: '👩‍🎨'
	},
	'/indépendant': {
		name: 'Indépendant',
		description:
			"Calculer le revenu d'un dirigeant de EURL, EI, ou SARL majoritaire",
		icone: '👩‍🔧'
	},
	'/assimilé-salarié': {
		name: 'Assimilé salarié',
		description:
			"Calculer le revenu d'un dirigeant de SAS, SASU ou SARL minoritaire",
		icone: '☂️'
	},
	'/comparaison-régimes-sociaux': {
		name: 'Comparaison statuts',
		description:
			'Simulez les différences entre les régimes (cotisations,retraite, maternité, maladie, etc.)',
		icone: '📊'
	},
	'/coronavirus': {
		name: 'Coronavirus',
		description: '',
		icone: '👨‍🔬'
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
					<Link
						className="ui__ interactive card box"
						to={{
							state: { fromSimulateurs: true },
							pathname: sitePaths.simulateurs['assimilé-salarié']
						}}
					>
						<div className="ui__ big box-icon">{emoji('☂️')}</div>
						<Trans i18nKey="simulateurs.accueil.assimilé">
							<h3>Assimilé salarié</h3>
							<p className="ui__ notice" css="flex: 1">
								Calculer le revenu d'un dirigeant de SAS, SASU ou SARL
								minoritaire
							</p>
						</Trans>
					</Link>
					<Link
						className="ui__ interactive card box"
						to={{
							state: { fromSimulateurs: true },
							pathname: sitePaths.simulateurs.indépendant
						}}
					>
						<div className="ui__ big box-icon">{emoji('👩‍🔧')}</div>
						<Trans i18nKey="simulateurs.accueil.indépendant">
							<h3>Indépendant</h3>
							<p className="ui__ notice" css="flex: 1">
								Calculer le revenu d'un dirigeant de EURL, EI, ou SARL
								majoritaire
							</p>
						</Trans>
					</Link>
					<Link
						className="ui__ interactive card box"
						to={{
							state: { fromSimulateurs: true },
							pathname: sitePaths.simulateurs['auto-entrepreneur']
						}}
					>
						<div className="ui__ big box-icon">{emoji('🚶‍♂️')}</div>
						<Trans i18nKey="simulateurs.accueil.auto">
							<h3>Auto-entrepreneur</h3>
							<p className="ui__ notice" css="flex: 1">
								Calculer le revenu (ou le chiffre d'affaires) d'un
								auto-entrepreneur
							</p>
						</Trans>
					</Link>
					<Link
						className="ui__ interactive card box"
						to={{
							state: { fromSimulateurs: true },
							pathname: sitePaths.simulateurs.salarié
						}}
					>
						<div className="ui__ big box-icon">{emoji('🤝')}</div>
						<Trans i18nKey="simulateurs.accueil.salarié">
							<h3>Salarié</h3>
							<p className="ui__ notice" css="flex: 1">
								Calculer le salaire net, brut, ou total d'un salarié, stagiaire,
								ou assimilé
							</p>
						</Trans>
					</Link>
					<Link
						className="ui__ interactive card box"
						to={{
							state: { fromSimulateurs: true },
							pathname: sitePaths.simulateurs['artiste-auteur']
						}}
					>
						<div className="ui__ big box-icon">{emoji('👩‍🎨')}</div>
						<Trans i18nKey="simulateurs.accueil.artiste-auteur">
							<h3>Artiste-auteur</h3>
							<p className="ui__ notice" css="flex: 1">
								Estimer les cotisations sociales d'un artiste ou auteur
							</p>
						</Trans>
					</Link>
					<Link
						className="ui__ interactive card box"
						to={{
							state: { fromSimulateurs: true },
							pathname: sitePaths.simulateurs.comparaison
						}}
					>
						<div className="ui__ big box-icon">{emoji('📊')}</div>
						<Trans i18nKey="simulateurs.accueil.comparaison">
							<h3>Comparaison statuts</h3>
							<p className="ui__ notice" css="flex: 1">
								Simulez les différences entre les régimes (cotisations,
								retraite, maternité, maladie, etc.)
							</p>
						</Trans>
					</Link>
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
