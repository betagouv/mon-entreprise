import { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { styled } from 'styled-components'

import { Button } from '../buttons'
import { HelpIcon } from '../icons'
import { PopoverWithTrigger } from '../popover/PopoverWithTrigger'

export interface Props {
	subject: string
	popoverTitle?: string
	description?: string | ReactNode
	children?: ReactNode
}

export function HelpButton({ subject, children }: Props) {
	const { t } = useTranslation()

	if (!children) {
		return null
	}

	const ariaLabel = t(
		'components.help-button.aria-label',
		'Aide sur {{ subject }}',
		{
			subject,
		}
	)

	return (
		<PopoverWithTrigger
			trigger={(buttonProps) => (
				<StyledButton
					light
					className="print-hidden"
					aria-haspopup="dialog"
					title={ariaLabel}
					aria-label={ariaLabel}
					// eslint-disable-next-line react/jsx-props-no-spreading
					{...buttonProps}
				>
					<HelpIcon />
				</StyledButton>
			)}
		>
			{children}
		</PopoverWithTrigger>
	)
}

const StyledButton = styled(Button)`
	margin-left: ${({ theme }) => theme.spacings.sm};
	&& {
		padding: 0;
		vertical-align: middle;
		display: inline-flex;
		border: none;
		background-color: transparent;

		&:hover {
			opacity: 0.9;
		}
	}
`
