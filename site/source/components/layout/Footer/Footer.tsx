import { Helmet } from 'react-helmet-async'
import { Trans, useTranslation } from 'react-i18next'
import { generatePath, matchPath, useLocation } from 'react-router-dom'
import { styled } from 'styled-components'

import Contact from '@/components/Contact'
import FeedbackButton from '@/components/Feedback'
import { ForceThemeProvider } from '@/components/utils/DarkModeContext'
import { Emoji } from '@/design-system/emoji'
import { FooterContainer } from '@/design-system/footer'
import { FooterColumn } from '@/design-system/footer/column'
import { GithubIcon } from '@/design-system/icons'
import { Container } from '@/design-system/layout'
import { Link } from '@/design-system/typography/link'
import { Body } from '@/design-system/typography/paragraphs'
import { alternatePathname, useSitePaths } from '@/sitePaths'
import { isNotNull } from '@/utils'

import InscriptionBetaTesteur from './InscriptionBetaTesteur'
import LegalNotice from './LegalNotice'
import PrivacyPolicy from './PrivacyPolicy'
import TermsOfUse from './TermsOfUse'

const altPathname = alternatePathname()

const altPathnnamesWithParams = (
	lang: keyof typeof altPathname,
	path: string
) =>
	Object.entries(altPathname[lang])
		.filter(([pth]) => /\/:/.test(pth))
		.map(([pth, alt]) => {
			const match = matchPath(pth, path)

			return match && generatePath(alt, match.params)
		})
		.filter(isNotNull)

export default function Footer() {
	const { absoluteSitePaths } = useSitePaths()
	const { pathname } = useLocation()
	const { t, i18n } = useTranslation()
	const language = i18n.language as 'fr' | 'en'

	const path = decodeURIComponent(
		pathname.replace(/^\/(mon-entreprise|infrance)/, '')
	)
	const altLang = language === 'en' ? 'fr' : 'en'
	const altHref =
		(language === 'en'
			? import.meta.env.VITE_FR_BASE_URL
			: import.meta.env.VITE_EN_BASE_URL) +
		(altPathname[language][path] ??
			altPathnnamesWithParams(language, path)?.[0] ??
			'/')

	const isFrenchMode = language === 'fr'

	return (
		<>
			<Helmet>
				{altHref && (
					<link
						key={altLang}
						rel="alternate"
						hrefLang={altLang}
						href={altHref}
					/>
				)}
			</Helmet>

			<footer role="contentinfo" id="footer">
				<Container
					backgroundColor={(theme) =>
						theme.darkMode
							? theme.colors.extended.dark[600]
							: theme.colors.bases.tertiary[100]
					}
				>
					<FeedbackButton key={`${pathname}-feedback-key`} />
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
					<ForceThemeProvider forceTheme="dark">
						<FooterContainer
							className="print-hidden"
							role="navigation"
							aria-label={t('Menu de navigation')}
						>
							<FooterColumn>
								{language === 'fr' && (
									<nav title="Première colonne du menu">
										<ul>
											<StyledLi>
												<Link to={absoluteSitePaths.plan} noUnderline>
													<Trans>Plan du site</Trans> <Emoji emoji="🧭" />
												</Link>
											</StyledLi>
											<StyledLi>
												<Link
													to={absoluteSitePaths.nouveautés.index}
													noUnderline
												>
													Nouveautés <Emoji emoji="✨" />
												</Link>
											</StyledLi>
											<StyledLi>
												<Link to={absoluteSitePaths.budget} noUnderline>
													Budget <Emoji emoji="🔦" />
												</Link>
											</StyledLi>
											<StyledLi>
												<Link to={absoluteSitePaths.stats} noUnderline>
													Statistiques <Emoji emoji="📊" />
												</Link>
											</StyledLi>
										</ul>
									</nav>
								)}
							</FooterColumn>
							<FooterColumn>
								<nav title="Deuxième colonne du menu">
									<ul>
										<StyledLi>
											<Link
												to={absoluteSitePaths.développeur.index}
												noUnderline
											>
												<Trans>Intégrer nos simulateurs</Trans>{' '}
												<Emoji emoji="📥" />
											</Link>
										</StyledLi>
										{language === 'fr' && (
											<StyledLi>
												<InscriptionBetaTesteur /> <Emoji emoji="💌" />
											</StyledLi>
										)}
										<StyledLi>
											<Link
												href="https://github.com/betagouv/mon-entreprise"
												noUnderline
												aria-label={t('footer.github.new-window')}
											>
												<Trans i18nKey="footer.github.text">
													Voir le code source sur Github
												</Trans>{' '}
												<GithubIcon
													style={{
														width: '18px',
														height: '18px',
														margin: '0 0.2rem',
														verticalAlign: 'middle',
														fill: '#e6edf3',
													}}
												/>
											</Link>
										</StyledLi>
										{altHref && (
											<StyledLi>
												<Link
													href={altHref}
													noUnderline
													openInSameWindow
													lang={isFrenchMode ? 'en' : 'fr'}
												>
													{isFrenchMode
														? 'Switch to the English version'
														: 'Passer à la version française'}
												</Link>
											</StyledLi>
										)}
									</ul>
								</nav>
							</FooterColumn>

							<FooterColumn>
								<nav title="Troisième colonne du menu">
									<ul>
										<StyledLi>
											<Contact />
										</StyledLi>
										<StyledLi>
											<LegalNotice />
										</StyledLi>
										<StyledLi>
											<TermsOfUse />
										</StyledLi>
										<StyledLi>
											<PrivacyPolicy />
										</StyledLi>
										{language === 'fr' && (
											<StyledLi>
												<Link
													to={absoluteSitePaths.accessibilité}
													aria-label={t(
														'footer.accessibilitéAriaLabel',
														'Accessibilité : partiellement conforme, en savoir plus'
													)}
													noUnderline
												>
													<Trans i18nKey="footer.accessibilité">
														Accessibilité : partiellement conforme
													</Trans>
												</Link>
											</StyledLi>
										)}
									</ul>
								</nav>
							</FooterColumn>
						</FooterContainer>
					</ForceThemeProvider>
				</Container>
			</footer>
		</>
	)
}

const StyledLi = styled.li`
	margin-top: ${({ theme }) => theme.spacings.sm};
`
