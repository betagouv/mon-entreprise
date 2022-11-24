import { Helmet } from 'react-helmet-async'
import { Trans, useTranslation } from 'react-i18next'
import styled, { ThemeProvider } from 'styled-components'

import PageFeedback from '@/components/Feedback'
import LegalNotice from '@/components/LegalNotice'
import Emoji from '@/components/utils/Emoji'
import { FooterContainer } from '@/design-system/footer'
import { FooterColumn } from '@/design-system/footer/column'
import { Container } from '@/design-system/layout'
import { Link } from '@/design-system/typography/link'
import { Body } from '@/design-system/typography/paragraphs'
import { alternateLinks, useSitePaths } from '@/sitePaths'

import InscriptionBetaTesteur from './InscriptionBetaTesteur'
import Privacy from './Privacy'
import { useShowFeedback } from './useShowFeedback'

const hrefLangLink = alternateLinks()

export default function Footer() {
	const { absoluteSitePaths } = useSitePaths()
	const showFeedback = useShowFeedback()
	const { t, i18n } = useTranslation()
	const language = i18n.language as 'fr' | 'en'

	const currentEnv = import.meta.env.MODE
	const encodedUri =
		typeof window !== 'undefined' &&
		(currentEnv === 'production' || currentEnv === 'development'
			? `${window.location.protocol}//${window.location.host}`
			: '') + window.location.pathname
	const uri =
		currentEnv === 'production'
			? (encodedUri || '').replace(/\/$/, '')
			: encodedUri || ''
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
			<footer role="contentinfo" id="footer">
				<Container
					backgroundColor={(theme) =>
						theme.darkMode
							? theme.colors.extended.dark[600]
							: theme.colors.bases.tertiary[100]
					}
				>
					{showFeedback && <PageFeedback />}
					{language === 'en' && (
						<Body>
							This website is provided by the{' '}
							<Link
								href="https://www.urssaf.fr"
								aria-label={t(
									'Urssaf, voir le site urssaf.fr, nouvelle fenêtre'
								)}
							>
								Urssaf
							</Link>
							, the French social security contributions collector.
						</Body>
					)}
				</Container>

				<Container backgroundColor={(theme) => theme.colors.bases.primary[700]}>
					<ThemeProvider theme={(theme) => ({ ...theme, darkMode: true })}>
						<FooterContainer className="print-hidden" role="navigation">
							<FooterColumn>
								{language === 'fr' && (
									<nav>
										<ul>
											<li>
												<StyledLink to={absoluteSitePaths.plan}>
													<Trans>Plan du site</Trans>
												</StyledLink>
											</li>
											<li>
												<StyledLink to={absoluteSitePaths.nouveautés}>
													Nouveautés <Emoji emoji="✨" />
												</StyledLink>
											</li>
											<li>
												<StyledLink to={absoluteSitePaths.stats}>
													Stats <Emoji emoji="📊" />
												</StyledLink>
											</li>
											<li>
												<StyledLink to={absoluteSitePaths.budget}>
													Budget <Emoji emoji="💶" />
												</StyledLink>
											</li>
										</ul>
									</nav>
								)}
							</FooterColumn>
							<FooterColumn>
								<nav>
									<ul>
										<li>
											<StyledLink to={absoluteSitePaths.développeur.index}>
												<Trans>Intégrer nos simulateurs</Trans>
											</StyledLink>
										</li>
										{language === 'fr' && (
											<li>
												<InscriptionBetaTesteur />
											</li>
										)}
										{hrefLink && (
											<li key={hrefLink.hrefLang}>
												<StyledLink
													href={hrefLink.href}
													openInSameWindow
													lang={hrefLink.hrefLang === 'en' ? 'en' : 'fr'}
												>
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
												</StyledLink>
											</li>
										)}
									</ul>
								</nav>
							</FooterColumn>

							<FooterColumn>
								<nav>
									<ul>
										<li>
											<LegalNotice />
										</li>
										<li>
											<Privacy />
										</li>
										{language === 'fr' && (
											<li>
												<StyledLink
													to={absoluteSitePaths.accessibilité}
													aria-label={t(
														'footer.accessibilitéAriaLabel',
														'Accessibilité : non conforme, en savoir plus'
													)}
												>
													<Trans i18nKey="footer.accessibilité">
														Accessibilité : non conforme
													</Trans>
												</StyledLink>
											</li>
										)}
									</ul>
								</nav>
							</FooterColumn>
						</FooterContainer>
					</ThemeProvider>
				</Container>
			</footer>
		</>
	)
}

const StyledLink = styled(Link)`
	text-decoration: none;
`
