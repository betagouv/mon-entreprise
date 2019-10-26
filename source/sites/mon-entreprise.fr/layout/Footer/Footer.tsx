import PageFeedback from 'Components/Feedback/PageFeedback'
import LegalNotice from 'Components/LegalNotice'
import NewsletterRegister from 'Components/NewsletterRegister'
import { SitePathsContext } from 'Components/utils/withSitePaths'
import { lensPath, view } from 'ramda'
import React, { useContext } from 'react'
import emoji from 'react-easy-emoji'
import { Helmet } from 'react-helmet'
import { Link } from 'react-router-dom'
import SocialIcon from 'Ui/SocialIcon'
import i18n from '../../../../i18n'
import { hrefLangLink } from '../../sitePaths'
import './Footer.css'
import Privacy from './Privacy'

const feedbackBlacklist = [
	['index'],
	['entreprise', 'statutJuridique', 'index'],
	['simulateurs', 'indépendant'],
	['simulateurs', 'auto-entrepreneur'],
	['simulateurs', 'assimilé-salarié'],
	['simulateurs', 'salarié']
].map(lensPath)

const Footer = () => {
	const sitePaths = useContext(SitePathsContext)
	const hrefLink =
		hrefLangLink[i18n.language][
			decodeURIComponent(
				(process.env.NODE_ENV === 'production'
					? window.location.protocol + '//' + window.location.host
					: '') + window.location.pathname
			).replace(/\/$/, '')
		] || []
	return (
		<div className="footer-container">
			<Helmet>
				{hrefLink.map(({ href, hrefLang }) => (
					<link
						key={hrefLang}
						rel="alternate"
						hrefLang={hrefLang}
						href={href}
					/>
				))}
			</Helmet>
			<footer className="footer">
				<PageFeedback
					blacklist={feedbackBlacklist.map(lens => view(lens, sitePaths))}
				/>
				<div className="ui__ container">
					<NewsletterRegister />

					<hr className="footer__separator" />

					{i18n.language === 'en' && (
						<p className="ui__ notice">
							This website is provided by the{' '}
							<a href="https://www.urssaf.fr">Urssaf</a>, the French social
							security contributions collector, and the government’s public
							startup incubator, <a href="https://beta.gouv.fr">beta.gouv.fr</a>
							.
						</p>
					)}

					<div style={{ display: 'flex', justifyContent: 'center' }}>
						<a href="https://www.facebook.com/monentreprisefr/">
							<SocialIcon media="facebook" />
						</a>
						<a href="https://twitter.com/monentreprisefr">
							<SocialIcon media="twitter" />
						</a>
						<a href="https://www.linkedin.com/company/mon-entreprise-fr/">
							<SocialIcon media="linkedin" />
						</a>
						<a href="mailto:contact@mon-entreprise.beta.gouv.fr">
							<SocialIcon media="email" />
						</a>
						<a href="https://github.com/betagouv/mon-entreprise/">
							<SocialIcon media="github" />
						</a>
					</div>
					<p className="ui__ notice" style={{ textAlign: 'center' }}>
						<LegalNotice />
						{'  •  '}
						<Privacy />
						{'  •  '}
						<a href="https://github.com/betagouv/mon-entreprise/releases">
							Nouveautés
						</a>
						{'  •  '}
						<a href="https://mon-entreprise.fr/stats">Stats</a>
						{'  •  '}{' '}
						<Link to={sitePaths.integration.index}>
							Intégrer nos simulateurs
						</Link>
						{!!hrefLink.length && '  •  '}
						{hrefLink.map(({ hrefLang, href }) => (
							<a
								href={href}
								key={hrefLang}
								style={{ textDecoration: 'underline' }}>
								{hrefLang === 'fr' ? (
									<> Passer en français {emoji('🇫🇷')}</>
								) : hrefLang === 'en' ? (
									<> Switch to English {emoji('🇬🇧')}</>
								) : (
									hrefLang
								)}
							</a>
						))}
					</p>
				</div>
			</footer>
		</div>
	)
}
export default Footer
