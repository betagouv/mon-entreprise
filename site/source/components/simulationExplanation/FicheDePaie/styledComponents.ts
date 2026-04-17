import { styled } from 'styled-components'

import { Body, H3, H4 } from '@/design-system'

export const TitreSection = styled(H3)`
	border-bottom: 1px solid
		${({ theme }) =>
			theme.darkMode
				? theme.colors.extended.grey[300]
				: theme.colors.extended.dark[800]};
	margin: ${({ theme }) => theme.spacings.lg} 0
		${({ theme }) => theme.spacings.xs} 0;
	padding-bottom: ${({ theme }) => theme.spacings.xs};
	font-size: ${({ theme }) => theme.fontSizes.lg};
`

export const Titre = styled(H4)`
	margin: ${({ theme }) => theme.spacings.xl} 0 0;
	scroll-margin-top: ${({ theme }) => theme.spacings.md};
	font-family: 'Montserrat', sans-serif;
	font-weight: 700;
	color: ${({ theme }) =>
		theme.darkMode
			? theme.colors.extended.grey[100]
			: theme.colors.bases.primary[700]};
	font-size: ${({ theme }) => theme.baseFontSize};
`

export const Liste = styled.ul`
	list-style: none;
	padding-left: 0;
`

export const EnTête = styled(Body)`
	margin: 0;
	color: ${({ theme }) =>
		theme.darkMode
			? theme.colors.extended.grey[100]
			: theme.colors.bases.primary[700]};
	font-weight: 700;
`
