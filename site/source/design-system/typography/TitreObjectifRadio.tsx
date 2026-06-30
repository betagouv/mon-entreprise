import { ReactNode } from 'react'
import { styled } from 'styled-components'

import { BodyStyle } from './paragraphs'

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
	${BodyStyle}
	font-weight: 700;
	padding: ${({ theme }) => theme.spacings.xxs} 0 0;
	margin-bottom: ${({ theme }) => theme.spacings.xxs};
`
