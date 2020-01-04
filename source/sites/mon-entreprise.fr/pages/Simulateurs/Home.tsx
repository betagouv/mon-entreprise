import { T } from 'Components'
import { SitePathsContext } from 'Components/utils/withSitePaths'
import React, { useContext } from 'react'
import emoji from 'react-easy-emoji'
import { Helmet } from 'react-helmet'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

export default function Simulateurs() {
	const sitePaths = useContext(SitePathsContext)
	const { t } = useTranslation()
	const titre = t('simulateurs.accueil.titre', 'Simulateurs disponibles')
	return (
		<>
			<Helmet>
				<title>{titre}</title>
			</Helmet>

			<section className="ui__ full-width light-bg center-flex">
				<h1 css="min-width: 100%; text-align: center">{titre}</h1>
				<Link
					className="ui__ interactive card box"
					to={{
						state: { fromSimulateurs: true },
						pathname: sitePaths.simulateurs['assimilé-salarié']
					}}
				>
					<div className="ui__ big box-icon">{emoji('☂️')}</div>
					<T k="simulateurs.accueil.assimilé">
						<h3>Assimilé salarié</h3>
						<p className="ui__ notice" css="flex: 1">
							Calculer le revenu d'un dirigeant de SAS, SASU ou SARL minoritaire
						</p>
					</T>
				</Link>
				<Link
					className="ui__ interactive card box"
					to={{
						state: { fromSimulateurs: true },
						pathname: sitePaths.simulateurs.indépendant
					}}
				>
					<div className="ui__ big box-icon">{emoji('🃏')}</div>
					<T k="simulateurs.accueil.indépendant">
						<h3>Indépendant</h3>
						<p className="ui__ notice" css="flex: 1">
							Calculer le revenu d'un dirigeant de EURL, EI, ou SARL majoritaire
						</p>
					</T>
				</Link>
				<Link
					className="ui__ interactive card box"
					to={{
						state: { fromSimulateurs: true },
						pathname: sitePaths.simulateurs['auto-entrepreneur']
					}}
				>
					<div className="ui__ big box-icon">{emoji('🧢')}</div>
					<T k="simulateurs.accueil.auto">
						<h3>Auto-entrepreneur</h3>
						<p className="ui__ notice" css="flex: 1">
							Calculer le revenu (ou le chiffre d'affaires) d'un
							auto-entrepreneur
						</p>
					</T>
				</Link>
				<Link
					className="ui__ interactive card box"
					to={{
						state: { fromSimulateurs: true },
						pathname: sitePaths.simulateurs.salarié
					}}
				>
					<div className="ui__ big box-icon">{emoji('🤝')}</div>
					<T k="simulateurs.accueil.salarié">
						<h3>Salarié</h3>
						<p className="ui__ notice" css="flex: 1">
							Calculer le salaire net, brut, ou total d'un salarié, stagiaire,
							ou assimilé
						</p>
					</T>
				</Link>
				<Link
					className="ui__ interactive card box"
					to={{
						state: { fromSimulateurs: true },
						pathname: sitePaths.simulateurs['artiste-auteur']
					}}
				>
					<div className="ui__ big box-icon">{emoji('👩‍🎨')}</div>
					<T k="simulateurs.accueil.salarié">
						<h3>Artiste-auteur</h3>
						<p className="ui__ notice" css="flex: 1">
							Estimer les cotisations sociales d'un artiste ou auteur
						</p>
					</T>
				</Link>
				<Link
					className="ui__ interactive card box"
					to={{
						state: { fromSimulateurs: true },
						pathname: sitePaths.simulateurs.comparaison
					}}
				>
					<div className="ui__ big box-icon">{emoji('📊')}</div>
					<T k="simulateurs.accueil.comparaison">
						<h3>Comparaison statuts</h3>
						<p className="ui__ notice" css="flex: 1">
							Simulez les différences entre les régimes (cotisations, retraite,
							maternité, maladie, etc.)
						</p>
					</T>
				</Link>
			</section>
			<section>
				<T k="simulateurs.accueil.description">
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
				</T>
			</section>
		</>
	)
}
