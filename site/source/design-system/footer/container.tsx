import { Grid } from '@/design-system/layout'
import { ReactNode } from 'react'
import styled from 'styled-components'

const StyledGrid = styled(Grid)`
	padding: 2rem 0;
`

type FooterContainerProps = {
	children: ReactNode
	className?: string
}

export const FooterContainer = ({
	children,
	className,
}: FooterContainerProps) => {
	return (
		<StyledGrid className={className} container>
			{children}
		</StyledGrid>
	)
}
