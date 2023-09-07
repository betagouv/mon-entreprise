import { ReactNode } from 'react'
import { styled } from 'styled-components'

import { Grid } from '@/design-system/layout'
import { H1 } from '@/design-system/typography/heading'

type FooterColumnType = {
	children: ReactNode
	title?: string
}

const StyledGrid = styled(Grid)`
	ul {
		list-style-type: none;
		line-height: 1.5rem;
		font-size: 1rem;
		padding: 0;
		a,
		button {
			font-weight: normal !important;
		}
	}
`

export const FooterColumn = ({ children, title }: FooterColumnType) => {
	return (
		<StyledGrid item xs={12} lg={4}>
			{title && <H1>{title}</H1>}
			{children}
		</StyledGrid>
	)
}
