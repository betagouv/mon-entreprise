import { useButton } from '@react-aria/button'
import { useOverlayTrigger } from '@react-aria/overlays'
import { useOverlayTriggerState } from '@react-stately/overlays'
import React, { useMemo, useRef } from 'react'
import Popover from './Popover'

type PopoverWithTriggerProps = {
	trigger: React.ReactElement<HTMLButtonElement>
	children: React.ReactNode
	title?: string
}

export default function PopoverWithTrigger({
	children,
	title,
	trigger,
}: PopoverWithTriggerProps) {
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
	const { triggerProps, overlayProps } = useOverlayTrigger(
		{ type: 'dialog' },
		state,
		openButtonRef
	)

	const triggerButton = useMemo(
		() =>
			React.cloneElement(trigger, {
				ref: openButtonRef,
				...buttonProps,
				...triggerProps,
			}),
		[openButtonRef, buttonProps, triggerProps, trigger]
	)

	return (
		<>
			{triggerButton}
			{state.isOpen && (
				<Popover
					title={title}
					onClose={state.close.bind(state)}
					isDismissable
					{...overlayProps}
					role="dialog"
				>
					{children}
				</Popover>
			)}
		</>
	)
}
