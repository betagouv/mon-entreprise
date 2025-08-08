import { ReactNode } from 'react'
import { styled } from 'styled-components'

import { baseHeading, CircledArrowIcon } from '@/design-system'

const ItemTitle = ({ children }: { children: ReactNode }) => {
	return (
		<StyledContainer>
			<StyledCircledArrowIcon />
			<Title>{children}</Title>
		</StyledContainer>
	)
}

const StyledCircledArrowIcon = styled(CircledArrowIcon)`
	@media (max-width: ${({ theme }) => theme.breakpointsWidth.sm}) {
		display: none;
	}
	height: 2rem;
	margin-right: 0.5rem;
`

const Title = styled.span`
	${baseHeading}
	font-size: 1.25rem;
	line-height: 1.75rem;
`
const StyledContainer = styled.div`
	display: flex;
`

export default ItemTitle
