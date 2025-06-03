import { useTranslation } from 'react-i18next'
import { styled } from 'styled-components'

import logoSvgFRDark from '@/assets/images/logo-monentreprise_white.svg'
import logoSvgFR from '@/assets/images/logo-monentreprise.svg'
import logoSvgENDark from '@/assets/images/logo-mycompany_white.svg'
import logoSvgEN from '@/assets/images/logo-mycompany.svg'
import { Link } from '@/design-system/typography/link'
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
			data-test-id="logo img"
			alt={t('navbar.logo', 'Urssaf Mon entreprise')}
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

const StyledLogo = styled.img`
	height: 100%;
`

export function LogoWithLink() {
	const { t } = useTranslation()

	return (
		<LogoContainer
			href={import.meta.env.VITE_FR_BASE_URL}
			target="_blank"
			rel="noreferrer"
			aria-label={t('Accéder au site mon-entreprise, nouvelle fenêtre')}
		>
			<Logo />
		</LogoContainer>
	)
}

const LogoContainer = styled(Link)`
	display: block;
	height: 4rem;
	padding: ${({ theme }) => theme.spacings.md} 0;
	text-align: center;
`
