import React from 'react'
import { styled } from 'styled-components'

import { HelpIcon } from '../icons'
import { Tooltip } from '../tooltip'

export interface Props {
	description: React.ReactNode
}

export function HelpButton({ description }: Props) {
	return (
		<StyledTooltip className="print-hidden" tooltip={description}>
			<HelpIcon />
		</StyledTooltip>
	)
}

const StyledTooltip = styled(Tooltip)`
	margin-left: ${({ theme }) => theme.spacings.sm};
	vertical-align: middle;
	display: inline-flex;
`
