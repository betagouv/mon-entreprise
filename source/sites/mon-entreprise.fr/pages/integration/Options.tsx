import { SitePathsContext } from 'Components/utils/withSitePaths'
import React, { useContext } from 'react'
import emoji from 'react-easy-emoji'
import { Trans } from 'react-i18next'
import { Link } from 'react-router-dom'
import illustration from './illustration.png'

export default function Options() {
	const sitePaths = useContext(SitePathsContext)
	return (
		<>
			<h1 css="margin-bottom: 0">
				<Trans i18nKey="pages.développeurs.home.titre">
					Intégrez le droit de la sécurité sociale au coeur de vos outils
				</Trans>
			</h1>
			<div css="text-align: center; ">
				<img css="height: 250px" src={illustration} />
			</div>
			<p>
				<Trans i18nKey="pages.développeurs.home.description">
					En plus du site mon-entreprise.fr, nous développons des outils
					gratuits et libres à intégrer directement chez vous, dans les parcours
					habituels de vos utilisateurs.
				</Trans>
			</p>
			<section className="ui__ center-flex">
				<Link
					className="ui__ interactive card box light-bg"
					css="flex: 1"
					to={sitePaths.integration.iframe}
				>
					<div className="ui__ big box-icon">{emoji('📱')}</div>
					<Trans i18nKey="pages.développeurs.home.choice.iframe">
						<h3>Intégrer un simulateur</h3>
						<p className="ui__ notice" css="flex: 1">
							Intégrer l'un de nos simulateurs en un clic dans votre site Web,
							via un script clé en main.
						</p>
					</Trans>
					<div className="ui__ small simple button">
						<Trans>Commencer</Trans>
					</div>
				</Link>
				<Link
					className="ui__ interactive card box light-bg"
					css="flex: 1"
					to={sitePaths.integration.library}
				>
					<div className="ui__ big box-icon">{emoji('🧰')}</div>
					<Trans i18nKey="pages.développeurs.choice.library">
						<h3>Utiliser le moteur de calcul</h3>
						<p className="ui__ notice" css="flex: 1">
							L'intégralité du moteur de calcul socio-fiscal développé par
							l'Urssaf, mis à disposition librement sous forme de bibliothèque
							NPM.
						</p>
					</Trans>
					<div className="ui__ small simple button">
						<Trans>Commencer</Trans>
					</div>
				</Link>
			</section>
		</>
	)
}
