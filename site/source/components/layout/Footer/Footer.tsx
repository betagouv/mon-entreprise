import PageFeedback from '@/components/Feedback'
import LegalNotice from '@/components/LegalNotice'
import Emoji from '@/components/utils/Emoji'
import { FooterContainer } from '@/design-system/footer'
import { FooterColumn } from '@/design-system/footer/column'
import { Container } from '@/design-system/layout'
import { Link } from '@/design-system/typography/link'
import { Body } from '@/design-system/typography/paragraphs'
import { alternateLinks, useSitePaths } from '@/sitePaths'
import { Helmet } from 'react-helmet-async'
import { Trans, useTranslation } from 'react-i18next'
import { ThemeProvider } from 'styled-components'
import InscriptionBetaTesteur from './InscriptionBetaTesteur'
import Privacy from './Privacy'
import { useShowFeedback } from './useShowFeedback'

const hrefLangLink = alternateLinks()

export default function Footer() {
	const { absoluteSitePaths } = useSitePaths()
	const showFeedback = useShowFeedback()
	const language = useTranslation().i18n.language as 'fr' | 'en'

	const currentEnv = import.meta.env.MODE
	const encodedUri =
		typeof window !== 'undefined' &&
		(currentEnv === 'production' || currentEnv === 'development'
			? `${window.location.protocol}//${window.location.host}`
			: '') + window.location.pathname
	const uri = (encodedUri || '').replace(/\/$/, '')
	const hrefLink = hrefLangLink[language][uri]

	return (
		<>
			<Helmet>
				{hrefLink && (
					<link
						key={hrefLink.hrefLang}
						rel="alternate"
						hrefLang={hrefLink.hrefLang}
						href={hrefLink.href}
					/>
				)}
			</Helmet>
			<div
				css={`
					flex: 1;
				`}
			/>
			<footer>
				<Container
					backgroundColor={(theme) => theme.colors.bases.tertiary[100]}
				>
					{showFeedback && <PageFeedback />}
					{language === 'en' && (
						<Body>
							This website is provided by the{' '}
							<Link href="https://www.urssaf.fr">Urssaf</Link>, the French
							social security contributions collector.
						</Body>
					)}
				</Container>

				<Container backgroundColor={(theme) => theme.colors.bases.primary[700]}>
					<ThemeProvider theme={(theme) => ({ ...theme, darkMode: true })}>
						<FooterContainer className="print-hidden">
							<FooterColumn>
								{language === 'fr' && (
									<ul>
										<li>
											<Link to={absoluteSitePaths.nouveautés}>
												Nouveautés <Emoji emoji="✨" />
											</Link>
										</li>
										<li>
											<Link to={absoluteSitePaths.stats}>
												Stats <Emoji emoji="📊" />
											</Link>
										</li>
										<li>
											<Link to={absoluteSitePaths.budget}>
												Budget <Emoji emoji="💶" />
											</Link>
										</li>
									</ul>
								)}
							</FooterColumn>
							<FooterColumn>
								<ul>
									<li>
										<Link to={absoluteSitePaths.développeur.index}>
											<Trans>Intégrer nos simulateurs</Trans>
										</Link>
									</li>
									{language === 'fr' && (
										<li>
											<InscriptionBetaTesteur />
										</li>
									)}
									{hrefLink && (
										<li key={hrefLink.hrefLang}>
											<Link href={hrefLink.href} openInSameWindow>
												{hrefLink.hrefLang === 'fr' ? (
													<>
														Passer en français <Emoji emoji="🇫🇷" />
													</>
												) : hrefLink.hrefLang === 'en' ? (
													<>
														Switch to English <Emoji emoji="🇬🇧" />
													</>
												) : (
													hrefLink.hrefLang
												)}
											</Link>
										</li>
									)}
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
											<Link to={absoluteSitePaths.accessibilité}>
												<Trans i18nKey="footer.accessibilité">
													Accessibilité : non conforme
												</Trans>
											</Link>
										</li>
									)}
								</ul>
							</FooterColumn>
						</FooterContainer>
					</ThemeProvider>
				</Container>
			</footer>
		</>
	)
}
