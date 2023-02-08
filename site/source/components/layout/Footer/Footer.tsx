import { Helmet } from 'react-helmet-async'
import { Trans, useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'
import styled from 'styled-components'

import FeedbackButton from '@/components/Feedback'
import LegalNotice from '@/components/LegalNotice'
import { ForceThemeProvider } from '@/contexts/DarkModeContext'
import { Button } from '@/design-system/buttons'
import { Emoji } from '@/design-system/emoji'
import { FooterContainer } from '@/design-system/footer'
import { FooterColumn } from '@/design-system/footer/column'
import { Container, Grid } from '@/design-system/layout'
import { Link } from '@/design-system/typography/link'
import { Body } from '@/design-system/typography/paragraphs'
import { alternateLinks, useSitePaths } from '@/sitePaths'

import InscriptionBetaTesteur from './InscriptionBetaTesteur'
import Privacy from './Privacy'

const hrefLangLink = alternateLinks()

export default function Footer() {
	const { absoluteSitePaths } = useSitePaths()
	const { t, i18n } = useTranslation()
	const language = i18n.language as 'fr' | 'en'

	const currentPath = useLocation().pathname

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
	const hrefLink =
		hrefLangLink[language][uri] ?? hrefLangLink[language][uri + '/']

	const isFrenchMode = language === 'fr'

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
												<Link to={absoluteSitePaths.nouveautés} noUnderline>
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
										{hrefLink && (
											<StyledLi key={hrefLink.hrefLang}>
												<Grid container spacing={2}>
													<Grid item>
														<StyledButton
															openInSameWindow
															href={hrefLink.href}
															aria-disabled={isFrenchMode}
															aria-label={
																isFrenchMode
																	? t('Version française du site activée.')
																	: t('Passer à la version française du site')
															}
															lang="fr"
															data-test-id="fr-switch-button"
														>
															FR <Emoji emoji="🇫🇷" />
														</StyledButton>
													</Grid>
													<Grid item>
														<StyledButton
															href={hrefLink.href}
															openInSameWindow
															lang="en"
															aria-disabled={!isFrenchMode}
															aria-label={
																!isFrenchMode
																	? t('English version of the website enabled.')
																	: t(
																			'Switch to the english version of the website'
																	  )
															}
															data-test-id="en-switch-button"
														>
															EN <Emoji emoji="🇬🇧" />
														</StyledButton>
													</Grid>
												</Grid>
											</StyledLi>
										)}
									</ul>
								</nav>
							</FooterColumn>

							<FooterColumn>
								<nav title="Troisième colonne du menu">
									<ul>
										<StyledLi>
											<LegalNotice />
										</StyledLi>
										<StyledLi>
											<Privacy />
										</StyledLi>
										{language === 'fr' && (
											<StyledLi>
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

const StyledButton = styled(Button)`
	padding: 10px 16px 10px 16px;
	border-radius: 4px;

	&[aria-disabled='true'] {
		background-color: ${({ theme }) => theme.colors.bases.primary[300]};
		pointer-events: none;
	}
`

const StyledLi = styled.li`
	margin-top: ${({ theme }) => theme.spacings.sm};
`
