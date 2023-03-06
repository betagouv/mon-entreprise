import { ReactNode } from 'react'
import styled from 'styled-components'

import { CircledArrowIcon } from '@/design-system/icons'
import { H3 } from '@/design-system/typography/heading'

const ItemTitle = ({ children }: { children: ReactNode }) => {
	return (
		<StyledH3>
			<StyledCircledArrowIcon /> {children}
		</StyledH3>
	)
}

const StyledCircledArrowIcon = styled(CircledArrowIcon)`
	flex-shrink: 0;
	width: 2.5rem;
	@media (max-width: ${({ theme }) => theme.breakpointsWidth.md}) {
		width: 1.5rem;
	}
`

const StyledH3 = styled(H3)`
	display: inline-flex;
	align-items: center;
	justify-content: flex-start;
	font-size: 1.625rem;
	margin: 0;
	gap: 1rem;
	text-align: left;
	@media (max-width: ${({ theme }) => theme.breakpointsWidth.md}) {
		font-size: 1.25rem;
	}
	@media (max-width: ${({ theme }) => theme.breakpointsWidth.sm}) {
		font-size: 1rem;
	}
`

export default ItemTitle
