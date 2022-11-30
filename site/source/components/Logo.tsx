import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { useDarkMode } from '@/hooks/useDarkMode'
import logoSvgFR from '@/images/logo-monentreprise.svg'
import logoSvgFRDark from '@/images/logo-monentreprise_white.svg'
import logoSvgEN from '@/images/logo-mycompany.svg'
import logoSvgENDark from '@/images/logo-mycompany_white.svg'

/* Figma source: https://www.figma.com/file/YJUpRNO12lcPUDsEYEXzT9/logo-monentreprisee-urssaf-edition */

export function Logo() {
	const {
		i18n: { language },
		t,
	} = useTranslation()

	const [isDarkModeEnabled] = useDarkMode()

	return (
		<StyledLogo
			alt={t('navbar.logo')}
			src={
				language === 'fr'
					? isDarkModeEnabled
						? logoSvgFRDark
						: logoSvgFR
					: isDarkModeEnabled
					? logoSvgENDark
					: logoSvgEN
			}
		/>
	)
}

const StyledLogo = styled.img.attrs({ 'data-test-id': 'logo img' })`
	height: 100%;
`
