import { ReactNode } from 'react'
import { styled } from 'styled-components'

import { CircledArrowIcon, H3 } from '@/design-system'

const ItemTitle = ({ children }: { children: ReactNode }) => {
	return (
		<StyledContainer>
			<StyledCircledArrowIcon />
			<Title as={'span'}>{children}</Title>
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

const Title = styled(H3)`
	margin: 0;
`
const StyledContainer = styled.div`
	display: flex;
`

export default ItemTitle
