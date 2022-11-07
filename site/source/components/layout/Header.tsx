import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { Logo } from '@/components/Logo'
import SearchButton from '@/components/SearchButton'
import BrowserOnly from '@/components/utils/BrowserOnly'
import Emoji from '@/components/utils/Emoji'
import { Container } from '@/design-system/layout'
import { Switch } from '@/design-system/switch'
import { Link } from '@/design-system/typography/link'
import { useDarkMode } from '@/hooks/useDarkMode'
import { useSitePaths } from '@/sitePaths'

import NewsBanner from './NewsBanner'

export default function Header() {
	const { absoluteSitePaths } = useSitePaths()
	const {
		i18n: { language },
		t,
	} = useTranslation()

	const [darkMode, setDarkMode] = useDarkMode()

	return (
		<header role="banner">
			<Container>
				<StyledHeader role="banner">
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
							aria-label={t(
								darkMode
									? 'navbar.deactivate-darkmode'
									: 'navbar.activate-darkmode'
							)}
						/>
						<Emoji emoji="🌙" aria-hidden />
					</div>

					{language === 'fr' && <SearchButton />}
				</StyledHeader>
				<BrowserOnly>{language === 'fr' && <NewsBanner />}</BrowserOnly>
			</Container>
		</header>
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
