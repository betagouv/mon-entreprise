import React, { ReactElement, ReactNode } from 'react'
import { Tooltip as RTooltip } from 'react-tooltip'

import 'react-tooltip/dist/react-tooltip.css'

import { styled } from 'styled-components'

// TODO: Replace react-tooltip with @floating-ui/react-dom for more control (see DateField.tsx for example)
export const Tooltip = ({
	children,
	tooltip,
	className,
	id,
}: {
	children: ReactElement
	tooltip: ReactNode
	className?: string
	// A11y : préciser un aria-describedby sur l'élément visé par le tooltip
	id: string
}) => {
	return (
		<StyledSpan>
			{React.Children.map(children, (child) => {
				if (React.isValidElement(child) && child.type !== React.Fragment) {
					return React.cloneElement(child, { id } as {
						id: string
					})
				}

				throw new Error(
					'Tooltip children must be a valid React element and not a React fragment.'
				)
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
	display: flex;
	align-items: center;
	justify-content: center;
	.react-tooltip {
		opacity: 1 !important;
		background: ${({ theme }) => theme.colors.extended.grey[800]};
		color: ${({ theme }) => theme.colors.extended.grey[100]};
		z-index: 100;
	}
`
