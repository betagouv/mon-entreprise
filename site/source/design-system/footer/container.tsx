import { ReactNode } from 'react'
import { styled } from 'styled-components'

import { Grid } from '../layout'

const StyledGrid = styled(Grid)`
	padding: 2rem 0;
`

type FooterContainerProps = {
	children: ReactNode
	className?: string
	role?: string
}

export const FooterContainer = ({
	children,
	className,
	role,
	...props
}: FooterContainerProps) => {
	return (
		<StyledGrid className={className} container role={role} {...props}>
			{children}
		</StyledGrid>
	)
}
