import { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { styled } from 'styled-components'

import { Button } from '../buttons'
import { InfoIcon } from '../icons'
import { Markdown } from '../markdown'
import { PopoverWithTrigger } from '../popover/PopoverWithTrigger'

export interface Props {
	subject: string
	popoverTitle?: string
	description?: string | ReactNode
	children?: ReactNode
}

export function InfoButton({
	subject,
	popoverTitle,
	description,
	children,
}: Props) {
	const { t } = useTranslation()

	if (!description && !children) {
		return null
	}

	const ariaLabel = t('components.info.aria-label', 'Info sur {{ subject }}', {
		subject,
	})

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
					<InfoIcon />
				</StyledButton>
			)}
			title={popoverTitle ?? subject}
		>
			{description && typeof description === 'string' ? (
				<Markdown>{description}</Markdown>
			) : (
				description
			)}
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
