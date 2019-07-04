/* @flow */

import { T } from 'Components'
import PageFeedback from 'Components/Feedback/PageFeedback'
import LegalNotice from 'Components/LegalNotice'
import usePersistingState from 'Components/utils/usePersistingState'
import withSitePaths from 'Components/utils/withSitePaths'
import withTracker from 'Components/utils/withTracker'
import { compose, lensPath, view } from 'ramda'
import React from 'react'
import emoji from 'react-easy-emoji'
import { Helmet } from 'react-helmet'
import { withTranslation } from 'react-i18next'
import SocialIcon from 'Ui/SocialIcon'
import i18n from '../../../../i18n'
import { hrefLangLink } from '../../sitePaths'
import './Footer.css'
import Integration from './Integration'
import Privacy from './Privacy'

type OwnProps = {}

const feedbackBlacklist = [
	['index'],
	['entreprise', 'statutJuridique', 'index'],
	['sécuritéSociale', 'indépendant'],
	['sécuritéSociale', 'auto-entrepreneur'],
	['sécuritéSociale', 'assimilé-salarié'],
	['sécuritéSociale', 'salarié']
].map(lensPath)

const Footer = ({ tracker, t, sitePaths }) => {
	const [registered, setUserRegistered] = usePersistingState(
		'app::newsletter::registered',
		false
	)
	const onSubmit = () => {
		tracker.push(['trackEvent', 'Newsletter', 'registered'])
		setTimeout(() => setUserRegistered(true), 0)
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
			<footer className="footer">
				<PageFeedback
					blacklist={feedbackBlacklist.map(lens => view(lens, sitePaths))}
				/>
				<div className="ui__ container">
					{!registered && (
						<>
							{' '}
							<h2>
								<T k="newsletter.register.titre">Restez informé</T>
							</h2>
							<div className="footer__newsletterContainer">
								<p>
									<T k="newsletter.register.description">
										Inscrivez-vous à notre newsletter mensuelle pour recevoir
										des{' '}
										<strong>
											conseils officiels sur la création d’entreprise
										</strong>{' '}
										et accéder aux nouvelles fonctionnalités en avant-première.
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
									<div>
										<label htmlFor="mce-EMAIL">
											<T>Votre adresse e-mail</T>
										</label>
										<div className="footer__registerField">
											<input type="email" name="EMAIL" id="mce-EMAIL" />
											<input
												className="ui__ plain small button"
												type="submit"
												value={t("S'inscrire")}
												name="subscribe"
												id="mc-embedded-subscribe"
											/>
										</div>
									</div>
								</form>
							</div>
						</>
					)}

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
						<a href="https://github.com/betagouv/syso/">
							<SocialIcon media="github" />
						</a>
					</div>
					<p className="ui__ notice" style={{ textAlign: 'center' }}>
						<LegalNotice />
						{'  •  '}
						<Privacy />
						{'  •  '}
						<a href="https://mon-entreprise.fr/stats">Stats</a>
						{i18n.language === 'fr' && (
							<>
								{'  •  '} <Integration />
							</>
						)}
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
	withSitePaths
)(Footer): React$ComponentType<OwnProps>)
