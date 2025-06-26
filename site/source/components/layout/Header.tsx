import { useTranslation } from 'react-i18next'
import { styled } from 'styled-components'

import { Logo } from '@/components/Logo'
import SearchButton from '@/components/SearchButton'
import { Emoji } from '@/design-system/emoji'
import { Container } from '@/design-system/layout'
import { Switch } from '@/design-system/switch'
import { Link } from '@/design-system/typography/link'
import { useDarkMode } from '@/hooks/useDarkMode'
import { useGetFullURL } from '@/hooks/useGetFullURL'
import { useSitePaths } from '@/sitePaths'

import { Appear } from '../ui/animate'
import BrowserOnly from '../utils/BrowserOnly'
import { Menu } from './Menu'
import NewsBannerWrapper from './NewsBanner'

export default function Header() {
	const { absoluteSitePaths } = useSitePaths()

	const fullURL = useGetFullURL()

	const { i18n, t } = useTranslation()

	const [darkMode, setDarkMode] = useDarkMode()

	return (
		<>
			<header
				role="banner"
				style={{
					zIndex: '1',
				}}
			>
				<ul className="skip-link print-hidden">
					<li>
						<a href={`${fullURL}#main`}>
							{t('header.main-shortcut.text', 'Aller au contenu principal')}
						</a>
					</li>
					<li>
						<a
							href={`${fullURL}#footer`}
							aria-label={t(
								'header.footer-shortcut.aria-label',
								'Passer le contenu principal et aller directement au pied de page'
							)}
						>
							{t(
								'header.footer-shortcut.text',
								'Aller directement au pied de page'
							)}
						</a>
					</li>
				</ul>
				<Container>
					<StyledHeader>
						<Link
							to={absoluteSitePaths.index}
							aria-label={t(
								'header.logo.aria-label',
								'Urssaf Mon entreprise, accéder à la page d’accueil'
							)}
						>
							<StyledLogo>
								<Logo />
							</StyledLogo>
						</Link>

						<div
							style={{
								display: 'flex',
								alignItems: 'center',
								marginRight: '1rem',
								marginLeft: 'auto',
							}}
							className="print-hidden"
						>
							<Emoji emoji="☀️" aria-hidden />
							<Switch
								isSelected={darkMode}
								onChange={setDarkMode}
								srOnlyLabel
								/* Need this useless aria-label to silence a React-Aria warning */
								aria-label=""
							>
								{t(
									'header.dark-mode-switch.activate-dark-mode',
									'Activer le mode sombre'
								)}
							</Switch>
							<Emoji emoji="🌙" aria-hidden />
						</div>

						{i18n.language === 'fr' && <SearchButton />}

						<Menu />
					</StyledHeader>

					<BrowserOnly>
						{i18n.language === 'fr' && (
							<Appear>
								<NewsBannerWrapper />
							</Appear>
						)}
					</BrowserOnly>
				</Container>
			</header>
		</>
	)
}

const StyledHeader = styled.div`
	min-height: ${({ theme }) => theme.spacings.xxxl};
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	justify-content: center;
	column-gap: ${({ theme }) => theme.spacings.xs};
	row-gap: ${({ theme }) => theme.spacings.md};
	a {
		height: 3rem;
		display: flex;
		align-items: center;
	}
	margin: ${({ theme }) => theme.spacings.sm} 0;
`

const StyledLogo = styled.div`
	height: 3rem;

	@media (max-width: ${({ theme }) => theme.breakpointsWidth.sm}) {
		height: 2.5rem;
	}
`
