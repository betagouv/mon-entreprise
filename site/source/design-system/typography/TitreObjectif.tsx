import { ReactNode } from 'react'
import { styled } from 'styled-components'

import { Body } from './paragraphs'

type Props = {
	id?: string
	children: ReactNode
}

export const TitreObjectif = ({ id, children }: Props) => {
	return (
		<StyledBody as="span" id={id}>
			{children}
		</StyledBody>
	)
}

const StyledBody = styled(Body)`
	font-weight: 700;
	display: inline;
	color: ${({ theme }) => theme.colors.extended.grey[100]};
	margin: 0;
`
