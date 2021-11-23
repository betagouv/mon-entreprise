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
	top: calc(100% + 0.5rem);
	z-index: 9000;
	border-radius: 0.3rem;
	width: 100%;
	box-shadow: 0 4px 8px #eee;
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
