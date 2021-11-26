import Grid from '@mui/material/Grid'
import { ReactNode } from 'react'
import styled from 'styled-components'

const StyledGrid = styled(Grid)`
	padding: 2rem 0;
`

type FooterContainerProps = {
	children: ReactNode
}

export const FooterContainer = ({ children }: FooterContainerProps) => {
	return <StyledGrid container>{children}</StyledGrid>
}
