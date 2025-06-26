import { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { styled } from 'styled-components'

import { WarningIcon } from '@/design-system/icons'
import { Tooltip } from '@/design-system/tooltip'

const WarningTooltip = ({ tooltip }: { tooltip: ReactNode }) => {
	const { t } = useTranslation()

	return (
		<Tooltip tooltip={tooltip}>
			<span className="sr-only">{t('Attention')}</span>
			<StyledWarningIcon />
		</Tooltip>
	)
}

export default WarningTooltip

const StyledWarningIcon = styled(WarningIcon)`
	margin-left: 0.5rem;
`
