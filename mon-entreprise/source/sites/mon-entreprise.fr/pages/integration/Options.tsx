import { SitePathsContext } from 'Components/utils/SitePathsContext'
import React, { useContext } from 'react'
import emoji from 'react-easy-emoji'
import { Trans } from 'react-i18next'
import { Link } from 'react-router-dom'
import { icons } from 'Components/ui/SocialIcon'
import illustration from './illustration.png'

export default function Options() {
	const sitePaths = useContext(SitePathsContext)
	return (
		<>
			<h1 css="margin-bottom: 0">
				<Trans>Outils pour les développeurs</Trans> <>{emoji('👨‍💻')}</>
			</h1>

			<div css="display: flex; align-items: flex-start; justify-content: space-between">
				<p
					className="ui__ lead"
					css={`
						margin-top: 25px;
					`}
				>
					<Trans i18nKey="pages.développeurs.home.description">
						En plus du site mon-entreprise.fr, nous développons des outils
						gratuits et libres à intégrer directement chez vous, dans les
						parcours habituels de vos utilisateurs.
					</Trans>
				</p>
				<div css="text-align: center; " className="ui__ hide-mobile">
					<img css="height: 250px" src={illustration} />
				</div>
			</div>
			<section className="ui__ full-width dark-bg center-flex">
				<Link
					className="ui__ interactive card box inverted-colors"
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
					className="ui__ interactive card box inverted-colors"
					css="flex: 1"
					to={sitePaths.integration.library}
				>
					<div className="ui__ big box-icon">{emoji('🧰')}</div>
					<Trans i18nKey="pages.développeurs.choice.library">
						<h3>Libraire de calcul</h3>
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
				<a
					className="ui__ interactive card box inverted-colors"
					css="flex: 1"
					target="_blank"
					href="https://github.com/betagouv/mon-entreprise"
				>
					<div className="ui__ big box-icon">
						<svg
							viewBox="15 15 34 34"
							style={{
								width: '3rem',
								height: '3rem',
								margin: 0
							}}
						>
							<g style={{ fill: '#f3f3f3' }}>
								<path d={icons['github'].icon} />
							</g>
						</svg>
					</div>
					<Trans i18nKey="pages.développeurs.choice.github">
						<h3>Contribuer sur GitHub</h3>
						<p className="ui__ notice" css="flex: 1">
							Tous nos outils sont ouverts et développés publiquement sur
							GitHub.
						</p>
					</Trans>
					<div className="ui__ small simple button">
						<Trans>Commencer</Trans>
					</div>
				</a>
				<a
					className="ui__ interactive card box inverted-colors"
					css="flex: 1"
					target="_blank"
					href="https://publi.codes"
				>
					<div className="ui__ big box-icon">{emoji('📚')}</div>
					<Trans i18nKey="pages.développeurs.choice.publicode">
						<h3>Publicodes</h3>
						<p className="ui__ notice" css="flex: 1">
							Nos outils sont propulsés par Publicodes, un nouveau langage pour
							encoder des algorithmes “explicables”.
						</p>
					</Trans>
					<div className="ui__ small simple button">
						<Trans>Découvrir</Trans>
					</div>
				</a>
			</section>
		</>
	)
}
