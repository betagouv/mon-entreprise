import { icons } from 'Components/ui/SocialIcon'
import Emoji from 'Components/utils/Emoji'
import { SitePathsContext } from 'Components/utils/SitePathsContext'
import { H1, H3 } from 'DesignSystem/typography/heading'
import { useContext } from 'react'
import { Trans } from 'react-i18next'
import { Link } from 'react-router-dom'
import Meta from '../../components/utils/Meta'
import illustration from './illustration.png'

export default function Options() {
	const sitePaths = useContext(SitePathsContext)
	return (
		<>
			<Meta
				page="intégration"
				title="Intégration"
				description="Outils pour les développeurs"
				ogImage={illustration}
			/>
			<H1>
				<Trans>Outils pour les développeurs</Trans> <Emoji emoji="👨‍💻" />
			</H1>

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
			<section className="ui__ full-width dark-bg box-container">
				<Link
					className="ui__ interactive card box inverted-colors"
					to={sitePaths.integration.iframe}
				>
					<div className="ui__ big box-icon">
						<Emoji emoji="📱" />
					</div>
					<Trans i18nKey="pages.développeurs.home.choice.iframe">
						<H3>Intégrer un simulateur</H3>
						<p className="ui__ notice">
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
					to={sitePaths.integration.library}
				>
					<div className="ui__ big box-icon">
						<Emoji emoji="🧰" />
					</div>
					<Trans i18nKey="pages.développeurs.choice.library">
						<H3>Libraire de calcul</H3>
						<p className="ui__ notice">
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
					target="_blank"
					href="https://github.com/betagouv/mon-entreprise"
				>
					<div className="ui__ big box-icon">
						<svg
							viewBox="15 15 34 34"
							style={{
								width: '3rem',
								height: '3rem',
								margin: 0,
							}}
						>
							<g style={{ fill: '#f3f3f3' }}>
								<path d={icons['github'].icon} />
							</g>
						</svg>
					</div>
					<Trans i18nKey="pages.développeurs.choice.github">
						<H3>Contribuer sur GitHub</H3>
						<p className="ui__ notice">
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
					target="_blank"
					href="https://publi.codes"
				>
					<div className="ui__ big box-icon">
						<Emoji emoji="📚" />
					</div>
					<Trans i18nKey="pages.développeurs.choice.publicodes">
						<H3>Publicodes</H3>
						<p className="ui__ notice">
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
