import { ReactNode } from 'react'
import { styled } from 'styled-components'

export type TitreObjectifRadioProps = {
	children: ReactNode
}

export const TitreObjectifRadio = ({ children }: TitreObjectifRadioProps) => {
	return <StyledLegend>{children}</StyledLegend>
}

const StyledLegend = styled.legend`
	color: ${({ theme }) =>
		theme.darkMode
			? theme.colors.extended.grey[100]
			: theme.colors.bases.primary[700]};
	font-weight: 700;
	font-family: ${({ theme }) => theme.fonts.main};
	padding: 0;
`
