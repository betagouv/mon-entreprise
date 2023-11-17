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
				<a href={`${fullURL}#main`} className="skip-link print-hidden">
					{t('Aller au contenu principal')}
				</a>
				<Container>
					<StyledHeader>
						<Link
							to={absoluteSitePaths.index}
							aria-label={t(
								"URSSAF Mon entreprise, accéder à la page d'accueil"
							)}
						>
							<StyledLogo>
								<Logo />
							</StyledLogo>
						</Link>

						<div style={{ flex: 1 }} />

						<div
							style={{
								display: 'flex',
								alignItems: 'center',
								marginRight: '1rem',
							}}
						>
							<Emoji emoji="☀️" aria-hidden />
							<Switch
								isSelected={darkMode}
								onChange={setDarkMode}
								role="checkbox"
								aria-label={
									darkMode
										? t(
												'navbar.deactivate-darkmode',
												'Désactiver le mode sombre'
										  )
										: t('navbar.activate-darkmode', 'Activer le mode sombre')
								}
							/>
							<Emoji emoji="🌙" aria-hidden />
						</div>

						{i18n.language === 'fr' && <SearchButton />}

						<Menu />
					</StyledHeader>
					{/* <BadNews /> */}

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
