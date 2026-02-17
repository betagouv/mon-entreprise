import { Helmet } from 'react-helmet-async'
import { Trans, useTranslation } from 'react-i18next'
import { styled } from 'styled-components'

import Contact from '@/components/Contact'
import FeedbackButton from '@/components/Feedback'
import { ForceThemeProvider } from '@/components/utils/DarkModeContext'
import {
	Body,
	Container,
	Emoji,
	FooterColumn,
	FooterContainer,
	GithubIcon,
	Link,
} from '@/design-system'
import { NavigationAPI, useNavigation } from '@/lib/navigation'
import { alternatePathname, useSitePaths } from '@/sitePaths'
import { isNotNull } from '@/utils'

import InscriptionBetaTesteur from './InscriptionBetaTesteur'
import LegalNotice from './LegalNotice'
import PrivacyPolicy from './PrivacyPolicy'
import TermsOfUse from './TermsOfUse'

const altPathname = alternatePathname()

const getAltPathnamesWithParams = (
	lang: keyof typeof altPathname,
	path: string,
	matchPath: NavigationAPI['matchPath'],
	generatePath: NavigationAPI['generatePath']
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
	const { currentPath, matchPath, generatePath } = useNavigation()
	const { t, i18n } = useTranslation()
	const language = i18n.language as 'fr' | 'en'

	const path = decodeURIComponent(
		currentPath.replace(/^\/(mon-entreprise|infrance)/, '')
	)
	const altLang = language === 'en' ? 'fr' : 'en'
	const altHref =
		(language === 'en'
			? import.meta.env.VITE_FR_BASE_URL
			: import.meta.env.VITE_EN_BASE_URL) +
		(altPathname[language][path] ??
			getAltPathnamesWithParams(language, path, matchPath, generatePath)?.[0] ??
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
					<FeedbackButton key={`${currentPath}-feedback-key`} />
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
						<FooterContainer className="print-hidden">
							<FooterColumn>
								{language === 'fr' && (
									<ul>
										<StyledLi>
											<Link to={absoluteSitePaths.plan} noUnderline>
												<Trans>Plan du site</Trans>
											</Link>
										</StyledLi>
										<StyledLi>
											<Link to={absoluteSitePaths.nouveautés.index} noUnderline>
												Nouveautés
											</Link>
										</StyledLi>
										<StyledLi>
											<Link to={absoluteSitePaths.budget} noUnderline>
												Budget
											</Link>
										</StyledLi>
										<StyledLi>
											<Link to={absoluteSitePaths.stats} noUnderline>
												Statistiques
											</Link>
										</StyledLi>
									</ul>
								)}
							</FooterColumn>
							<FooterColumn>
								<ul>
									<StyledLi>
										<Link to={absoluteSitePaths.développeur.index} noUnderline>
											<Trans>Intégrer nos simulateurs</Trans>{' '}
										</Link>
									</StyledLi>
									{language === 'fr' && (
										<StyledLi>
											<InscriptionBetaTesteur />
										</StyledLi>
									)}
									<StyledLi>
										<LinkAligned
											href="https://github.com/betagouv/mon-entreprise"
											noUnderline
											aria-label={t(
												'footer.github.new-window',
												'Voir le code source sur Github, nouvelle fenêtre'
											)}
										>
											<GithubIcon
												style={{
													width: '18px',
													height: '18px',
													verticalAlign: 'middle',
													fill: '#e6edf3',
												}}
											/>
											<Trans i18nKey="footer.github.text">
												Voir le code source sur Github
											</Trans>{' '}
										</LinkAligned>
									</StyledLi>
									{altHref && (
										<StyledLi>
											<LinkAligned
												href={altHref}
												noUnderline
												openInSameWindow
												lang={isFrenchMode ? 'en' : 'fr'}
											>
												{isFrenchMode ? (
													<>
														<Emoji emoji="🇬🇧" /> Switch to the English version
													</>
												) : (
													<>
														<Emoji emoji="🇫🇷" /> Passer à la version française
													</>
												)}
											</LinkAligned>
										</StyledLi>
									)}
								</ul>
							</FooterColumn>

							<FooterColumn>
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
const LinkAligned = styled(Link)`
	display: flex;
	align-items: center;
	gap: 0.5rem;
`
