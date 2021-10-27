import { Grid } from '@mui/material'
import { H1 } from 'DesignSystem/typography/heading'
import { ReactNode } from 'react'
import styled from 'styled-components'

type FooterColumnType = {
	children: ReactNode
	title?: string
}

const StyledGrid = styled(Grid)`
	ul {
		list-style-type: none;
		padding: 0;
	}
`

export const FooterColumn = ({ children, title }: FooterColumnType) => {
	return (
		<StyledGrid item xs={12} lg={4}>
			{title ?? <H1>{title}</H1>}
			{children}
		</StyledGrid>
	)
}
