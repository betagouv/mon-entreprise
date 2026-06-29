import { useTranslation } from 'react-i18next'
import { styled } from 'styled-components'

import { H2 } from '@/design-system'

import { ForceThemeProvider } from '../utils/DarkModeContext'

type Props = {
	children: React.ReactNode
}

export const BlocMontants = ({ children }: Props) => {
	const { t } = useTranslation()

	return (
		<Section>
			<StyledH2>
				{t('components.simulateur.zone-de-saisie.montants.titre', 'Montants')}
			</StyledH2>

			<ForceThemeProvider forceTheme="dark">{children}</ForceThemeProvider>
		</Section>
	)
}

const Section = styled.section`
	height: 100%;
	padding: ${({ theme }) => theme.spacings.lg};
	padding-top: ${({ theme }) => theme.spacings.md};

	@media not print {
		background-color: ${({ theme }) => theme.colors.bases.primary[700]};
		border-radius: ${({ theme }) => theme.box.borderRadius};
	}
`

const StyledH2 = styled(H2)`
	margin: 0;
	padding-bottom: ${({ theme }) => theme.spacings.lg};

	@media not print {
		color: ${({ theme }) => theme.colors.extended.grey[100]};
		&::after {
			border-color: ${({ theme }) => theme.colors.extended.grey[100]};
		}
	}
`
