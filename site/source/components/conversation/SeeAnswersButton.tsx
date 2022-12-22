import React from 'react'
import { Trans } from 'react-i18next'
import styled from 'styled-components'

import { PopoverWithTrigger, button } from '@/design-system'
import { Button } from '@/design-system/buttons'
import { Emoji } from '@/design-system/emoji'
import { FocusStyle } from '@/design-system/global-style'
import { StyledLink } from '@/design-system/typography/link'

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
				trigger={(buttonProps) => {
					console.log(buttonProps)

					return (
						<StyledButton {...buttonProps} aria-haspopup="dialog">
							{label ?? (
								<>
									<Emoji emoji="✏️" /> <Trans>Modifier mes réponses</Trans>
								</>
							)}
						</StyledButton>
					)
				}}
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
	color: ${({ theme }) => theme.colors.bases.primary[800]};
	border-radius: 0;
	&:hover {
		border: none;
		background-color: transparent;
		text-decoration: underline;
	}

	&:focus {
		${FocusStyle}
	}
`
