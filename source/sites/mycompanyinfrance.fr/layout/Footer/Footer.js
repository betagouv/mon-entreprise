/* @flow */

import PageFeedback from 'Components/Feedback/PageFeedback'
import LegalNotice from 'Components/LegalNotice'
import withColours from 'Components/utils/withColours'
import urssafSvg from 'Images/urssaf.svg'
import { compose } from 'ramda'
import React from 'react'
import emoji from 'react-easy-emoji'
import Helmet from 'react-helmet'
import i18n from '../../../../i18n'
import { feedbackBlacklist } from '../../config'
import { hrefLangLink } from '../../sitePaths'
import './Footer.css'
import betaGouvSvg from './logo-betagouv.svg'
import Privacy from './Privacy'

const Footer = ({ colours: { colour } }) => {
	console.log(
		hrefLangLink,
		decodeURIComponent(
			(process.env.NODE_ENV === 'production'
				? window.location.protocol + '//' + window.location.host
				: '') + window.location.pathname
		).replace(/\/$/, '')
	)
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
			<PageFeedback blacklist={feedbackBlacklist} />
			<footer className="footer" style={{ backgroundColor: `${colour}22` }}>
				<div className="ui__ container">
					<div style={{ textAlign: 'center' }}>
						<h3>Inscrivez-vous à notre newsletter</h3>
						<p>
							Vous aurez accès à des conseils sur la création, et vous pourrez
							accéder aux nouvelles fonctionalités en avant-première !
						</p>
						<div className="footer__registerContainer">
							<label htmlFor="footer__registerEmail" className="ui__ notice">
								Email
							</label>
							<div className="footer__registerField">
								<input id="footer__registerEmail" type="email" />
								<input
									className="ui__ plain button"
									type="submit"
									value="S'inscrire"
								/>
							</div>
						</div>
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
					</div>

					{i18n.language === 'en' && (
						<p className="ui__ notice">
							This website is provided by the{' '}
							<a href="https://www.urssaf.fr">URSSAF</a>, the French social
							security contributions collector, and the government’s public
							startup incubator, <a href="https://beta.gouv.fr">beta.gouv.fr</a>
							.
						</p>
					)}
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
export default compose(withColours)(Footer)
