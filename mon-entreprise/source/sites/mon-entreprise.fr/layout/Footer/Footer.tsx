import PageFeedback from 'Components/Feedback/PageFeedback'
import LegalNotice from 'Components/LegalNotice'
import NewsletterRegister from 'Components/NewsletterRegister'
import SocialIcon from 'Components/ui/SocialIcon'
import { SitePathsContext } from 'Components/utils/SitePathsContext'
import { useContext } from 'react'
import emoji from 'react-easy-emoji'
import { Helmet } from 'react-helmet'
import { Trans } from 'react-i18next'
import { Link, useLocation } from 'react-router-dom'
import useSimulatorsData from '../../pages/Simulateurs/metadata'
import i18n, { AvailableLangs } from '../../../../i18n'
import { hrefLangLink } from '../../sitePaths'
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
			simulators['demande-mobilité']
		]
			.map(s => s.path)
			.includes(currentPath)
	) {
		return true
	}
	return ![
		sitePath.index,
		...Object.values(simulators).map(s => s.path)
	].includes(currentPath)
}
export default function Footer() {
	const sitePaths = useContext(SitePathsContext)
	const showFeedback = useShowFeedback()
	const hrefLink =
		hrefLangLink[i18n.language as AvailableLangs][
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
				{showFeedback && <PageFeedback />}
				<div className="ui__ container">
					<NewsletterRegister />
					<hr className="footer__separator" />
				</div>
				{i18n.language === 'en' && (
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
					{i18n.language === 'fr' && (
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
