import PageFeedback from 'Components/Feedback'
import LegalNotice from 'Components/LegalNotice'
import Emoji from 'Components/utils/Emoji'
import { SitePathsContext } from 'Components/utils/SitePathsContext'
import { FooterContainer } from 'DesignSystem/footer'
import { FooterColumn } from 'DesignSystem/footer/column'
import { Container } from 'DesignSystem/layout'
import { Link } from 'DesignSystem/typography/link'
import { useContext } from 'react'
import { Helmet } from 'react-helmet'
import { Trans, useTranslation } from 'react-i18next'
import { hrefLangLink } from '../../../sitePaths'
import InscriptionBetaTesteur from './InscriptionBetaTesteur'
import Privacy from './Privacy'
import { SocialLinks } from './Social'
import { useShowFeedback } from './useShowFeedback'

export default function Footer() {
	const sitePaths = useContext(SitePathsContext)
	const showFeedback = useShowFeedback()
	const language = useTranslation().i18n.language as 'fr' | 'en'

	const currentEnv = process.env.NODE_ENV
	const { location } = window
	const encodedUri =
		(currentEnv === 'production' || currentEnv === 'development'
			? `${location.protocol}//${location.host}`
			: '') + window.location.pathname
	const uri = decodeURIComponent(encodedUri).replace(/\/$/, '')
	const hrefLink = hrefLangLink[language][uri] || []

	return (
		<div>
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
				<Container backgroundColor={(theme) => theme.colors.bases.primary[100]}>
					{showFeedback && <PageFeedback />}
					{language === 'en' && (
						<p className="ui__ notice" css="text-align: center">
							This website is provided by the{' '}
							<Link href="https://www.urssaf.fr">Urssaf</Link>, the French
							social security contributions collector.
						</p>
					)}
				</Container>

				<Container backgroundColor={(theme) => theme.colors.bases.primary[200]}>
					<SocialLinks />
				</Container>

				<Container backgroundColor={(theme) => theme.colors.bases.primary[100]}>
					<FooterContainer>
						<FooterColumn>
							{language === 'fr' && (
								<ul>
									<li>
										<Link to={sitePaths.nouveautés}>
											Nouveautés <Emoji emoji="✨" />
										</Link>
									</li>
									<li>
										<Link to={sitePaths.stats}>
											Stats <Emoji emoji="📊" />
										</Link>
									</li>
									<li>
										<Link to={sitePaths.budget}>
											Budget <Emoji emoji="💶" />
										</Link>
									</li>
								</ul>
							)}
						</FooterColumn>
						<FooterColumn>
							<ul>
								<li>
									<Link to={sitePaths.integration.index}>
										<Trans>Intégrer nos simulateurs</Trans>
									</Link>
								</li>
								{language === 'fr' && (
									<li>
										<InscriptionBetaTesteur />
									</li>
								)}
								{hrefLink.map(({ hrefLang, href }) => (
									<li key={hrefLang}>
										<Link href={href}>
											{hrefLang === 'fr' ? (
												<>
													Passer en français <Emoji emoji="🇫🇷" />
												</>
											) : hrefLang === 'en' ? (
												<>
													Switch to English <Emoji emoji="🇬🇧" />
												</>
											) : (
												hrefLang
											)}
										</Link>
									</li>
								))}
							</ul>
						</FooterColumn>

						<FooterColumn>
							<ul>
								<li>
									<LegalNotice />
								</li>
								<li>
									<Privacy />
								</li>
								{language === 'fr' && (
									<li>
										<Link to={sitePaths.accessibilité}>
											<Trans i18nKey="footer.accessibilité">
												Accessibilité : non conforme
											</Trans>
										</Link>
									</li>
								)}
							</ul>
						</FooterColumn>
					</FooterContainer>
				</Container>
			</footer>
		</div>
	)
}
