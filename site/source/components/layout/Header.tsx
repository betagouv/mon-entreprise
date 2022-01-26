import { Logo } from 'Components/Logo'
import SearchButton from 'Components/SearchButton'
import { SitePathsContext } from 'Components/utils/SitePathsContext'
import { Container } from 'DesignSystem/layout'
import { Link } from 'DesignSystem/typography/link'
import { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import NewsBanner from './NewsBanner'

export default function Header() {
	const sitePaths = useContext(SitePathsContext)
	const {
		i18n: { language },
	} = useTranslation()
	return (
		<Container>
			<StyledHeader>
				<Link to={sitePaths.index}>
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

			<NewsBanner />
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
