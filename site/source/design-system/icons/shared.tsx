import styled from 'styled-components'

export const StyledSVG = styled.svg`
	width: ${({ theme }) => theme.spacings.lg};
	height: ${({ theme }) => theme.spacings.lg};
	fill: ${({ theme }) => theme.colors.bases.primary[800]};
`
