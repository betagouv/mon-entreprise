import logoSvgFR from '@/images/logo-monentreprise.svg'
import logoSvgEN from '@/images/logo-mycompany.svg'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

/* Figma source: https://www.figma.com/file/YJUpRNO12lcPUDsEYEXzT9/logo-monentreprisee-urssaf-edition */

export function Logo() {
	const {
		i18n: { language },
		t
	} = useTranslation()

	return <StyledLogo alt={t("navbar.logo")} src={language === 'fr' ?logoSvgFR:logoSvgEN} />
}

const StyledLogo = styled.img.attrs({ 'data-test-id': 'logo img' })`
	height: 100%;
`
