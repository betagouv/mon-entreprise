import PageFeedback from 'Components/Feedback'
import LegalNotice from 'Components/LegalNotice'
import SocialIcon from 'Components/ui/SocialIcon'
import Emoji from 'Components/utils/Emoji'
import { SitePathsContext } from 'Components/utils/SitePathsContext'
import { FooterContainer } from 'DesignSystem/footer'
import { FooterColumn } from 'DesignSystem/footer/column'
import { Container } from 'DesignSystem/layout'
import { Link } from 'DesignSystem/typography/link'
import { useContext } from 'react'
import { Helmet } from 'react-helmet'
import { Trans, useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'
import useSimulatorsData from '../../../pages/Simulateurs/metadata'
import { hrefLangLink } from '../../../sitePaths'
import InscriptionBetaTesteur from './InscriptionBetaTesteur'
import Privacy from './Privacy'
import { SocialLinks } from './Social'

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
		<div className="">
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
				<Container>
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
