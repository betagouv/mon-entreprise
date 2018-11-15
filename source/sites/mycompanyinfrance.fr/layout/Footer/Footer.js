/* @flow */

import PageFeedback from 'Components/Feedback/PageFeedback'
import LegalNotice from 'Components/LegalNotice'
import withColours from 'Components/utils/withColours'
import urssafSvg from 'Images/urssaf.svg'
import { compose } from 'ramda'
import React from 'react'
import emoji from 'react-easy-emoji'
import Helmet from 'react-helmet'
import { Trans, withI18n } from 'react-i18next'
import { withRouter } from 'react-router'
import i18n from '../../../../i18n'
import { feedbackBlacklist } from '../../config'
import { hrefLangLink } from '../../sitePaths'
import './Footer.css'
import betaGouvSvg from './logo-betagouv.svg'
import Privacy from './Privacy'
const Footer = ({ colours: { colour } }) => {

	const hrefLink =
		hrefLangLink[i18n.language][
			decodeURIComponent(window.location.pathname).replace(/^\/$/, '')
		] || []
	console.log('yayayayyay', hrefLangLink, hrefLink)
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
					<p className="ui__ notice">
						<Trans i18nKey="piedDePage">
							Ce site est développé par l'
							<a href="https://www.urssaf.fr">URSSAF</a> et{' '}
							<a href="https://beta.gouv.fr">beta.gouv.fr</a>.
						</Trans>
					</p>
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
									<> Switch to english {emoji('🇬🇧')}</>
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
export default compose(
	withRouter,
	withColours,
	withI18n()
)(Footer)
