import { ReactNode } from 'react'
import { styled } from 'styled-components'

import { WarningIcon } from '@/design-system/icons'
import { Tooltip } from '@/design-system/tooltip'

const WarningTooltip = ({ tooltip }: { tooltip: ReactNode }) => {
	return (
		<Tooltip tooltip={tooltip}>
			<StyledWarningIcon aria-label="Attention" />
		</Tooltip>
	)
}

export default WarningTooltip

const StyledWarningIcon = styled(WarningIcon)`
	margin-left: 0.5rem;
`
