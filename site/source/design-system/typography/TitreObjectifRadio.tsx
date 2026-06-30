import { ReactNode } from 'react'
import { styled } from 'styled-components'

export type TitreObjectifRadioProps = {
	children: ReactNode

	'aria-describedby'?: string
}

export const TitreObjectifRadio = ({
	children,
	'aria-describedby': ariaDescribedby,
}: TitreObjectifRadioProps) => {
	return (
		<StyledLegend aria-describedby={ariaDescribedby}>{children}</StyledLegend>
	)
}

const StyledLegend = styled.legend`
	color: ${({ theme }) =>
		theme.darkMode
			? theme.colors.extended.grey[100]
			: theme.colors.bases.primary[700]};
	font-weight: 700;
	font-family: ${({ theme }) => theme.fonts.main};
	padding: 0;
	margin-bottom: ${({ theme }) => theme.spacings.xxs};
`
