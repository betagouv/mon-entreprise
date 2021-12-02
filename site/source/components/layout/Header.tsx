import SearchButton from 'Components/SearchButton'
import { SitePathsContext } from 'Components/utils/SitePathsContext'
import { Container } from 'DesignSystem/layout'
import { Link } from 'DesignSystem/typography/link'
import logoSvgFR from 'Images/logo-monentreprise.svg'
import logoSvgEN from 'Images/logo-mycompany.svg'
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
					{/* Figma source: https://www.figma.com/file/YJUpRNO12lcPUDsEYEXzT9/logo-monentreprisee-urssaf-edition */}
					{language === 'fr' ? (
						<Logo alt="Logo Mon-entreprise, site Urssaf" src={logoSvgFR} />
					) : (
						<Logo alt="Logo Mycompanyinfrance by Urssaf" src={logoSvgEN} />
					)}
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

const Logo = styled.img.attrs({ 'data-test-id': 'logo img' })`
	height: 70%;

	@media (min-width: ${({ theme }) => theme.breakpointsWidth.sm}) {
		height: 80%;
	}
`
