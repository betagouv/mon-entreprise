import Grid from '@mui/material/Grid'
import { ReactNode } from 'react'
import styled from 'styled-components'

const StyledGrid = styled(Grid)`
	padding-bottom: 2rem;
`

type FooterContainerProps = {
	children: ReactNode
}

export const FooterContainer = ({ children }: FooterContainerProps) => {
	return <StyledGrid container>{children}</StyledGrid>
}
