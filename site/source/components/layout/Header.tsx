import { Logo } from '@/components/Logo'
import SearchButton from '@/components/SearchButton'
import BrowserOnly from '@/components/utils/BrowserOnly'
import { Container } from '@/design-system/layout'
import { Link } from '@/design-system/typography/link'
import { useSitePaths } from '@/sitePaths'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import NewsBanner from './NewsBanner'

export default function Header() {
	const { absoluteSitePaths } = useSitePaths()
	const {
		i18n: { language },
		t,
	} = useTranslation()

	return (
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
				{language === 'fr' && <SearchButton />}
			</StyledHeader>
			<BrowserOnly>{language === 'fr' && <NewsBanner />}</BrowserOnly>
		</Container>
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
