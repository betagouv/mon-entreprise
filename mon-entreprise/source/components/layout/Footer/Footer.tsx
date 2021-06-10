import PageFeedback from 'Components/Feedback'
import LegalNotice from 'Components/LegalNotice'
import NewsletterRegister from 'Components/NewsletterRegister'
import SocialIcon from 'Components/ui/SocialIcon'
import { SitePathsContext } from 'Components/utils/SitePathsContext'
import { useContext } from 'react'
import emoji from 'react-easy-emoji'
import { Helmet } from 'react-helmet'
import { Trans, useTranslation } from 'react-i18next'
import { Link, useLocation } from 'react-router-dom'
import useSimulatorsData from '../../../pages/Simulateurs/metadata'
import { hrefLangLink } from '../../../sitePaths'
import './Footer.css'
import Privacy from './Privacy'

const useShowFeedback = () => {
	const currentPath = useLocation().pathname
	const sitePath = useContext(SitePathsContext)
	const simulators = useSimulatorsData()
	if (
		[
			simulators['aide-déclaration-indépendant'],
			simulators['comparaison-statuts'],
			simulators['demande-mobilité'],
		]
			.map((s) => s.path)
			.includes(currentPath)
	) {
		return true
	}
	return ![
		sitePath.index,
		...Object.values(simulators).map((s) => s.path),
		'',
		'/',
	].includes(currentPath)
}
export default function Footer() {
	const sitePaths = useContext(SitePathsContext)
	const showFeedback = useShowFeedback()
	const language = useTranslation().i18n.language as 'fr' | 'en'

	const encodedUri =
		(process.env.NODE_ENV === 'production' ||
		process.env.NODE_ENV === 'development'
			? window.location.protocol + '//' + window.location.host
			: '') + window.location.pathname
	const uri = decodeURIComponent(encodedUri).replace(/\/$/, '')

	const hrefLink = hrefLangLink[language][uri] || []

	return (
		<div className="footer-container print-display-none">
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
				{showFeedback && (
					<div>
						<div
							className="ui__ lighter-bg"
							css={`
								display: flex;
								justify-content: center;
							`}
						>
							<PageFeedback />
						</div>
					</div>
				)}
				<div className="ui__ container">
					<NewsletterRegister />
					<hr className="footer__separator" />
				</div>
				{language === 'en' && (
					<p className="ui__ notice" css="text-align: center">
						This website is provided by the{' '}
						<a href="https://www.urssaf.fr">Urssaf</a>, the French social
						security contributions collector.
					</p>
				)}
				<p className="ui__ notice" style={{ textAlign: 'center' }}>
					<LegalNotice />
					{'  •  '}
					<Privacy />

					{language === 'fr' && (
						<>
							{'  •  '}
							<Link to={sitePaths.nouveautés}>Nouveautés</Link>
							{'  •  '}
							<Link to={sitePaths.stats}>Stats</Link>
							{'  •  '}
							<Link to={sitePaths.budget}>Budget</Link>
						</>
					)}
					{'  •  '}
					<Link to={sitePaths.integration.index}>
						<Trans>Intégrer nos simulateurs</Trans>
					</Link>
					{language === 'fr' && (
						<>
							{'  •  '}
							<Link to={sitePaths.accessibilité}>
								<Trans i18nKey="footer.accessibilité">
									Accessibilité : non conforme
								</Trans>
							</Link>
						</>
					)}
					{!!hrefLink.length && '  •  '}
					{hrefLink.map(({ hrefLang, href }) => (
						<a
							href={href}
							key={hrefLang}
							style={{ textDecoration: 'underline' }}
						>
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

				<div style={{ display: 'flex', justifyContent: 'center' }}>
					<a href="https://twitter.com/monentreprisefr">
						<SocialIcon media="twitter" />
					</a>
					<a href="https://www.linkedin.com/company/mon-entreprise-fr/">
						<SocialIcon media="linkedin" />
					</a>
					<a href="https://github.com/betagouv/mon-entreprise/">
						<SocialIcon media="github" />
					</a>
				</div>
			</footer>
		</div>
	)
}
