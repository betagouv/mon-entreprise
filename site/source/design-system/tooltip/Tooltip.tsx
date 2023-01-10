import React, { ReactNode } from 'react'
import { Tooltip as RTooltip } from 'react-tooltip'

import 'react-tooltip/dist/react-tooltip.css'

import styled from 'styled-components'

export const Tooltip = ({
	children,
	tooltip,
	id,
	className,
}: {
	children: ReactNode
	tooltip: ReactNode
	id: string
	className?: string
}) => {
	return (
		<StyledSpan>
			{React.Children.map(children, (child) => {
				if (React.isValidElement(child)) {
					return React.cloneElement(child, { id } as { id: string })
				}
			})}
			<StyledRTooltip
				anchorId={id}
				className={className}
				id={`${id}-description`}
			>
				{tooltip}
			</StyledRTooltip>
		</StyledSpan>
	)
}

const StyledRTooltip = styled(RTooltip)`
	max-width: 20rem;
	font-size: 0.75rem;
`
const StyledSpan = styled.span`
	.react-tooltip {
		opacity: 1 !important;
		background: ${({ theme }) => theme.colors.extended.grey[800]};
		color: ${({ theme }) => theme.colors.extended.grey[100]};
	}
`
