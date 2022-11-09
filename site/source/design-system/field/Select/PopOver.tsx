import { FocusScope } from '@react-aria/focus'
import { DismissButton, useOverlay } from '@react-aria/overlays'
import { RefObject, ReactNode, useRef } from 'react'
import styled from 'styled-components'

interface PopoverProps {
	popoverRef?: RefObject<HTMLDivElement>
	children: ReactNode
	isOpen?: boolean
	onClose?: () => void
}

const Wrapper = styled.div`
	position: absolute;
	top: calc(100% + ${({ theme }) => theme.spacings.sm});
	left: -1px;
	z-index: 1000;
	border-radius: ${({ theme }) => theme.box.borderRadius};
	border: 1px solid
		${({ theme }) =>
			theme.darkMode
				? theme.colors.extended.dark[600]
				: theme.colors.extended.grey[200]};
	width: calc(100% + 2px);
	box-shadow: ${({ theme }) =>
		theme.darkMode ? theme.elevationsDarkMode[2] : theme.elevations[2]};
	background: ${({ theme }) =>
		theme.darkMode
			? theme.colors.extended.dark[500]
			: theme.colors.extended.grey[100]};
`

export function Popover(props: PopoverProps) {
	const ref = useRef<HTMLDivElement>(null)
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
