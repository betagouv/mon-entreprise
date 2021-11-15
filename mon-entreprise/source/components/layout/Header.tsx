import SearchButton from 'Components/SearchButton'
import { SitePathsContext } from 'Components/utils/SitePathsContext'
import { Container } from 'DesignSystem/layout'
import logoEnSvg from 'Images/logo-mycompany.svg'
import logoSvg from 'Images/logo.svg'
import urssafSvg from 'Images/Urssaf.svg'
import { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import NewsBanner from './NewsBanner'

export default function Header() {
	const sitePaths = useContext(SitePathsContext)
	const { language } = useTranslation().i18n
	return (
		<Container>
			<StyledHeader>
				<Link to={sitePaths.index}>
					<img
						alt="logo mon-entreprise.fr"
						src={language === 'fr' ? logoSvg : logoEnSvg}
					/>
				</Link>
				{language === 'fr' && <SearchButton />}

				<div
					css={`
						flex: 1;
					`}
				/>

				<a
					href="https://www.urssaf.fr"
					target="_blank"
					className="landing-header__institutional-logo"
				>
					<img alt="logo urssaf" src={urssafSvg} />
				</a>
			</StyledHeader>

			<NewsBanner />
		</Container>
	)
}

const StyledHeader = styled.div`
	height: ${({ theme }) => theme.spacings.xxxl};
	display: flex;
	align-items: center;
	a {
		height: 100%;
	}
	img {
		height: 100%;
		padding: ${({ theme }) => theme.spacings.xxs};
	}
	margin: ${({ theme }) => theme.spacings.sm} 0;
`
