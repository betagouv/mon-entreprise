import { Helmet } from 'react-helmet-async'
import { Trans, useTranslation } from 'react-i18next'
import { ThemeProvider } from 'styled-components'

import PageFeedback from '@/components/Feedback'
import LegalNotice from '@/components/LegalNotice'
import { Emoji } from '@/design-system/emoji'
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
						<FooterContainer
							className="print-hidden"
							role="navigation"
							aria-label={t('Menu de navigation')}
						>
							<FooterColumn>
								{language === 'fr' && (
									<nav title="firstColumnNav">
										<ul>
											<li>
												<Link to={absoluteSitePaths.plan} noUnderline>
													<Trans>Plan du site</Trans>
												</Link>
											</li>
											<li>
												<Link to={absoluteSitePaths.nouveautés} noUnderline>
													Nouveautés <Emoji emoji="✨" />
												</Link>
											</li>
											<li>
												<Link to={absoluteSitePaths.stats} noUnderline>
													Stats <Emoji emoji="📊" />
												</Link>
											</li>
											<li>
												<Link to={absoluteSitePaths.budget} noUnderline>
													Budget <Emoji emoji="💶" />
												</Link>
											</li>
										</ul>
									</nav>
								)}
							</FooterColumn>
							<FooterColumn>
								<nav title="secondColumnNav">
									<ul>
										<li>
											<Link
												to={absoluteSitePaths.développeur.index}
												noUnderline
											>
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
												<Link
													href={hrefLink.href}
													openInSameWindow
													lang={hrefLink.hrefLang === 'en' ? 'en' : 'fr'}
													noUnderline
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
												</Link>
											</li>
										)}
									</ul>
								</nav>
							</FooterColumn>

							<FooterColumn>
								<nav title="thirdColumnNav">
									<ul>
										<li>
											<LegalNotice />
										</li>
										<li>
											<Privacy />
										</li>
										{language === 'fr' && (
											<li>
												<Link
													to={absoluteSitePaths.accessibilité}
													aria-label={t(
														'footer.accessibilitéAriaLabel',
														'Accessibilité : non conforme, en savoir plus'
													)}
													noUnderline
												>
													<Trans i18nKey="footer.accessibilité">
														Accessibilité : non conforme
													</Trans>
												</Link>
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
