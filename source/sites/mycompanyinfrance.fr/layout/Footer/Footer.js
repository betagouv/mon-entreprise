/* @flow */

import { T } from 'Components'
import PageFeedback from 'Components/Feedback/PageFeedback'
import LegalNotice from 'Components/LegalNotice'
import withColours from 'Components/utils/withColours'
import withSitePaths from 'Components/utils/withSitePaths'
import withTracker from 'Components/utils/withTracker'
import urssafSvg from 'Images/urssaf.svg'
import { compose, lensPath, view } from 'ramda'
import React, { useState } from 'react'
import emoji from 'react-easy-emoji'
import Helmet from 'react-helmet'
import { withTranslation } from 'react-i18next'
import SocialIcon from 'Ui/SocialIcon'
import i18n from '../../../../i18n'
import safeLocalStorage from '../../../../storage/safeLocalStorage'
import { hrefLangLink } from '../../sitePaths'
import './Footer.css'
import betaGouvSvg from './logo-betagouv.svg'
import Privacy from './Privacy'

type OwnProps = {}

const feedbackBlacklist = [
	['index'],
	['sécuritéSociale', 'indépendant'],
	['sécuritéSociale', 'auto-entrepreneur'],
	['sécuritéSociale', 'assimilé-salarié'],
	['sécuritéSociale', 'salarié']
].map(lensPath)

const LOCAL_STORAGE_KEY = 'app::newsletter::registered'
const userAlreadyRegistered: boolean =
	JSON.parse(safeLocalStorage.getItem(LOCAL_STORAGE_KEY)) || false

const Footer = ({ colours: { colour }, tracker, t, sitePaths }) => {
	const [showNewsletterForm, toggleNewsletterForm] = useState(
		!userAlreadyRegistered
	)
	const onSubmit = () => {
		safeLocalStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(true))
		tracker.push(['trackEvent', 'Newsletter', 'registered'])
		setTimeout(() => toggleNewsletterForm(false), 0)
	}
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
			<PageFeedback
				blacklist={feedbackBlacklist.map(lens => view(lens, sitePaths))}
			/>
			<footer className="footer" style={{ backgroundColor: `${colour}22` }}>
				<div className="ui__ container">
					<div id="footerIcons">
						<a href="https://www.urssaf.fr">
							<img src={urssafSvg} alt="un service fourni par l'URSSAF" />
						</a>
						<a href="https://beta.gouv.fr">
							<img
								src={betaGouvSvg}
								alt="un service de l’Etat français incubé par beta.gouv.fr"
							/>
						</a>
					</div>

					{showNewsletterForm && (
						<>
							<p>
								<T k="newsletter.register.description1">
									Vous voulez des{' '}
									<strong>
										conseils officiels sur la création d’entreprise
									</strong>{' '}
									et accéder aux nouvelles fonctionnalités en avant-première ?
								</T>
							</p>
							<p>
								<T k="newsletter.register.description2">
									Inscrivez-vous à notre <strong>newsletter mensuelle</strong>{' '}
									en laissant votre email :
								</T>
							</p>
							<form
								className="footer__registerContainer"
								action="https://gouv.us13.list-manage.com/subscribe/post?u=732a4d1b0d2e8a1a1fd3d01db&amp;id=f146678e48"
								method="post"
								onSubmit={onSubmit}
								id="mc-embedded-subscribe-form"
								name="mc-embedded-subscribe-form"
								target="_blank">
								<div className="footer__registerField">
									<input type="email" name="EMAIL" id="mce-EMAIL" />
									<input
										className="ui__ plain button"
										type="submit"
										value={t("S'inscrire")}
										name="subscribe"
										id="mc-embedded-subscribe"
									/>
								</div>
							</form>
						</>
					)}

					{i18n.language === 'en' && (
						<p className="ui__ notice">
							This website is provided by the{' '}
							<a href="https://www.urssaf.fr">URSSAF</a>, the French social
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
						<a href="https://github.com/betagouv/syso/">
							<SocialIcon media="github" />
						</a>
					</div>
					<p className="ui__ notice" style={{ textAlign: 'center' }}>
						<LegalNotice />
						{'  •  '}
						<Privacy />
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
export default (compose(
	withTracker,
	withTranslation(),
	withSitePaths,
	withColours
)(Footer): React$ComponentType<OwnProps>)
