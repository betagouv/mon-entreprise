import SearchButton from 'Components/SearchButton'
import { SitePathsContext } from 'Components/utils/SitePathsContext'
import { Container } from 'DesignSystem/layout'
import { Link } from 'DesignSystem/typography/link'
import logoSvg from 'Images/logo.svg'
import { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import NewsBanner from './NewsBanner'

export default function Header() {
	const sitePaths = useContext(SitePathsContext)
	const {
		i18n: { language },
		t,
	} = useTranslation()
	return (
		<Container>
			<StyledHeader>
				<Link
					to={sitePaths.index}
				>
					<img alt="Service mon-entreprise urssaf" src={logoSvg} />
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
	}
	img {
		height: 100%;
		padding:  0;
	}
	margin: ${({ theme }) => theme.spacings.sm} 0;
`
