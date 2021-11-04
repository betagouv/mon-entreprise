import { useButton } from '@react-aria/button'
import { useOverlayTriggerState } from '@react-stately/overlays'
import React, { useRef } from 'react'
import { Trans } from 'react-i18next'
import styled from 'styled-components'
import Popover from '../Popover'

type LinkWithPopoverProps = {
	title: string
	children: React.ReactNode
	label: string
}

export default function LinkWithPopover({
	children,
	title,
	label,
}: LinkWithPopoverProps) {
	const state = useOverlayTriggerState({})
	const openButtonRef = useRef(null)

	// useButton ensures that focus management is handled correctly,
	// across all browsers. Focus is restored to the button once the
	// dialog closes.
	const { buttonProps } = useButton(
		{
			onPress: state.open.bind(state),
		},
		openButtonRef
	)

	return (
		<>
			<StyledButton light={light ?? false} {...buttonProps}>
				<Trans>{type}</Trans>
			</StyledButton>

			{state.isOpen && (
				<Popover
					title={title}
					isOpen
					onClose={state.close.bind(state)}
					isDismissable
				>
					{children}
				</Popover>
			)}
		</>
	)
}

const CircleIcon = styled.svg`
	width: ${({ theme }) => theme.spacings.md};
	height: ${({ theme }) => theme.spacings.md};
	path {
		fill: ${({ theme }) => theme.colors.bases.primary[600]};
	}
	margin-right: ${({ theme }) => theme.spacings.xxs};
`

const StyledButton = styled.button<{ light: boolean }>`
	--padding: 2px;
	height: calc(${({ theme }) => theme.spacings.md} + 2 * var(--padding));
	padding-left: var(--padding);
	padding-right: ${({ theme }) => theme.spacings.xs};
	font-size: 14px;
	line-height: 20px;
	font-family: ${({ theme }) => theme.fonts.main};
	text-transform: capitalize;
	font-weight: 700;
	display: inline-flex;
	align-items: center;
	color: ${({ theme }) => theme.colors.bases.primary[600]};
	border: 1px solid ${({ theme }) => theme.colors.bases.primary[600]};
	background-color: ${({ theme, light }) =>
		light ? theme.colors.extended.grey[100] : theme.colors.bases.primary[100]};
	border-radius: calc(${({ theme }) => theme.spacings.md} / 2 + var(--padding));
	transition: all 0.1s;

	:hover {
		background-color: ${({ theme, light }) => theme.colors.bases.primary[200]};
	}
`
