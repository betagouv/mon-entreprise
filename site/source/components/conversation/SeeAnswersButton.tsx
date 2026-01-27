import React from 'react'
import { Trans } from 'react-i18next'
import { styled } from 'styled-components'

import {
	Button,
	EditIcon,
	FocusStyle,
	PopoverWithTrigger,
} from '@/design-system'
import { useCurrentSimulatorData } from '@/hooks/useCurrentSimulatorData'

import Answers from './AnswerList'

export default function SeeAnswersButton({
	children,
	label,
}: {
	children?: React.ReactNode
	label?: React.ReactNode
}) {
	const { key: simulateur } = useCurrentSimulatorData()

	return (
		<>
			<PopoverWithTrigger
				trigger={(buttonProps) => (
					<StyledButton
						{...buttonProps}
						aria-haspopup="dialog"
						tracking={{
							feature: 'modifier_reponses',
							action: 'ouvre',
							simulateur,
						}}
					>
						{label ?? (
							<>
								<EditIcon /> <Trans>Modifier mes réponses</Trans>
							</>
						)}
					</StyledButton>
				)}
				ariaLabel="Modifier mes réponses"
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
	color: ${({ theme }) =>
		theme.darkMode
			? theme.colors.extended.grey[100]
			: theme.colors.bases.primary[700]};
	border-radius: 0;
	display: flex;
	align-items: center;
	svg {
		margin-right: ${({ theme }) => theme.spacings.xxs};
		fill: ${({ theme }) =>
			theme.darkMode
				? theme.colors.extended.grey[100]
				: theme.colors.bases.primary[700]};
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
