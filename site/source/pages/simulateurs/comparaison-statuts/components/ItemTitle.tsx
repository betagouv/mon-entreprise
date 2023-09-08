import { ReactNode } from 'react'
import styled from 'styled-components'

import { CircledArrowIcon } from '@/design-system/icons'
import { H3 } from '@/design-system/typography/heading'

const ItemTitle = ({ children }: { children: ReactNode }) => {
	return (
		<StyledContainer>
			<StyledCircledArrowIcon />
			<StyledH3>{children}</StyledH3>
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

const StyledH3 = styled(H3)`
	margin: 0;
	text-align: left;
	align-items: baseline;
`
const StyledContainer = styled.div`
	display: flex;
`

export default ItemTitle
