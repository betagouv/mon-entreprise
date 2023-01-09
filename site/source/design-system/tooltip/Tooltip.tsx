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
		<>
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
		</>
	)
}

const StyledRTooltip = styled(RTooltip)`
	max-width: 20rem;
	font-size: 0.75rem;
`
