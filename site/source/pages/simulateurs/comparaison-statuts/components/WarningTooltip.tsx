import { ReactNode } from 'react'
import { styled } from 'styled-components'

import { WarningIcon } from '@/design-system/icons'
import { Tooltip } from '@/design-system/tooltip'

const WarningTooltip = ({
	id,
	tooltip,
}: {
	id: string
	tooltip: ReactNode
}) => {
	return (
		<Tooltip tooltip={tooltip} id={id}>
			<StyledWarningIcon
				id={id}
				aria-label="Attention"
				aria-describedby={`${id}-description`}
			/>
		</Tooltip>
	)
}

export default WarningTooltip

const StyledWarningIcon = styled(WarningIcon)`
	margin-left: 0.5rem;
`
