import React from 'react'
import { Trans } from 'react-i18next'
import styled from 'styled-components'

import { PopoverWithTrigger } from '@/design-system'
import { Button } from '@/design-system/buttons'
import { FocusStyle } from '@/design-system/global-style'
import { EditIcon } from '@/design-system/icons'

import Answers from './AnswerList'

export default function SeeAnswersButton({
	children,
	label,
}: {
	children?: React.ReactNode
	label?: React.ReactNode
}) {
	return (
		<>
			<PopoverWithTrigger
				trigger={(buttonProps) => (
					<StyledButton {...buttonProps} aria-haspopup="dialog">
						{label ?? (
							<>
								<EditIcon /> <Trans>Modifier mes réponses</Trans>
							</>
						)}
					</StyledButton>
				)}
			>
				{(close) => <Answers onClose={close}>{children}</Answers>}
			</PopoverWithTrigger>
		</>
	)
}

const StyledButton = styled(Button)`
	background-color: transparent;
	padding: 0;
	border: none;
	color: ${({ theme }) => theme.colors.bases.primary[700]};
	border-radius: 0;
	display: flex;
	align-items: center;
	svg {
		margin-right: ${({ theme }) => theme.spacings.xxs};
		fill: ${({ theme }) => theme.colors.bases.primary[700]};
	}
	&:hover {
		border: none;
		background-color: transparent;
		text-decoration: underline;
	}

	&:focus {
		${FocusStyle}
	}
`
