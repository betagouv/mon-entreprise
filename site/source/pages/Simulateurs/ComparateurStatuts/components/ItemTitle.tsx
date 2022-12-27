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
	margin-right: 1rem;
`

const StyledH3 = styled(H3)`
	display: flex;
	align-items: center;
	font-size: 1.625rem;
	margin: 0;
	& img {
		margin-left: 0.5rem !important;
	}
`

export default ItemTitle
