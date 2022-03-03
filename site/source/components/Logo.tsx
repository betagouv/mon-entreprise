import logoSvgFR from 'Images/logo-monentreprise.svg'
import logoSvgEN from 'Images/logo-mycompany.svg'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

/* Figma source: https://www.figma.com/file/YJUpRNO12lcPUDsEYEXzT9/logo-monentreprisee-urssaf-edition */

export function Logo() {
	const {
		i18n: { language },
	} = useTranslation()

	return language === 'fr' ? (
		<StyledLogo alt="Logo Mon-entreprise, site Urssaf" src={logoSvgFR} />
	) : (
		<StyledLogo alt="Logo Mycompanyinfrance by Urssaf" src={logoSvgEN} />
	)
}

const StyledLogo = styled.img.attrs({ 'data-test-id': 'logo img' })`
	height: 100%;
`
