import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import logoSvgFR from '@/assets/images/logo-monentreprise.svg'
import logoSvgFRDark from '@/assets/images/logo-monentreprise_white.svg'
import logoSvgEN from '@/assets/images/logo-mycompany.svg'
import logoSvgENDark from '@/assets/images/logo-mycompany_white.svg'
import { useDarkMode } from '@/hooks/useDarkMode'

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
