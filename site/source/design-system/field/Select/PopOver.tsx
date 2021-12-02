import { FocusScope } from '@react-aria/focus'
import { DismissButton, useOverlay } from '@react-aria/overlays'
import * as React from 'react'
import styled from 'styled-components'

interface PopoverProps {
	popoverRef?: React.RefObject<HTMLDivElement>
	children: React.ReactNode
	isOpen?: boolean
	onClose?: () => void
}

const Wrapper = styled.div`
	position: absolute;
	top: calc(100% + ${({ theme }) => theme.spacings.sm});
	left: -1px;
	z-index: 1000;
	border-radius: ${({ theme }) => theme.box.borderRadius};
	border: 1px solid ${({ theme }) => theme.colors.extended.grey[200]};
	width: calc(100% + 2px);
	box-shadow: ${({ theme }) => theme.elevations[2]};
	background: white;
`

export function Popover(props: PopoverProps) {
	const ref = React.useRef<HTMLDivElement>(null)
	const { popoverRef = ref, isOpen, onClose, children } = props

	// Handle events that should cause the popup to close,
	// e.g. blur, clicking outside, or pressing the escape key.
	const { overlayProps } = useOverlay(
		{
			isOpen,
			onClose,
			shouldCloseOnBlur: true,
			isDismissable: false,
		},
		popoverRef
	)

	// Add a hidden <DismissButton> component at the end of the popover
	// to allow screen reader users to dismiss the popup easily.
	return (
		<FocusScope restoreFocus>
			<Wrapper {...overlayProps} ref={popoverRef}>
				{children}
				<DismissButton onDismiss={onClose} />
			</Wrapper>
		</FocusScope>
	)
}
