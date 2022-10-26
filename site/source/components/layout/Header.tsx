import { Logo } from '@/components/Logo'
import SearchButton from '@/components/SearchButton'
import BrowserOnly from '@/components/utils/BrowserOnly'
import { Container } from '@/design-system/layout'
import { Link } from '@/design-system/typography/link'
import { useSitePaths } from '@/sitePaths'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import NewsBanner from './NewsBanner'
import { Switch } from '@/design-system/switch'
import { useDarkMode } from '@/hooks/useDarkMode'
import Emoji from '@/components/utils/Emoji'

export default function Header() {
	const { absoluteSitePaths } = useSitePaths()
	const {
		i18n: { language },
		t,
	} = useTranslation()

	const { darkMode, setDarkMode } = useDarkMode()

	return (
		<header>
			<Container>
				<StyledHeader>
					<Link
						to={absoluteSitePaths.index}
						aria-label={t("Logo mon entreprise, accéder à la page d'accueil")}
					>
						<StyledLogo>
							<Logo />
						</StyledLogo>
					</Link>
					<div
						css={`
							flex: 1;
						`}
					/>
					<Emoji emoji="☀️" aria-hidden />
					<Switch
						defaultSelected={darkMode}
						onChange={setDarkMode}
						aria-label={t(
							darkMode
								? 'navbar.deactivate-darkmode'
								: 'navbar.activate-darkmode'
						)}
					/>
					<Emoji emoji="🌙" aria-hidden />
					{language === 'fr' && <SearchButton />}
				</StyledHeader>
				<BrowserOnly>{language === 'fr' && <NewsBanner />}</BrowserOnly>
			</Container>
		</header>
	)
}

const StyledHeader = styled.div`
	height: ${({ theme }) => theme.spacings.xxxl};
	display: flex;
	align-items: center;
	gap: ${({ theme }) => theme.spacings.xs};
	a {
		height: 100%;
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
