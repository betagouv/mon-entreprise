import { useOverlayTrigger } from '@react-aria/overlays'
import { useOverlayTriggerState } from '@react-stately/overlays'
import { AriaButtonProps } from '@react-types/button'
import { Button } from 'DesignSystem/buttons'
import React, { ReactElement, Ref, useMemo, useRef } from 'react'
import Popover from './Popover'
import { Link } from './typography/link'

type ButtonBuilderProps = AriaButtonProps & {
	ref: Ref<HTMLButtonElement>
}

type PopoverWithTriggerProps = {
	trigger: (
		propsToDispatch: ButtonBuilderProps
	) => ReactElement<typeof Button> | ReactElement<typeof Link>
	children: React.ReactNode | ((close: () => void) => React.ReactNode)
	title?: string
}

export default function PopoverWithTrigger({
	children,
	title,
	trigger,
}: PopoverWithTriggerProps) {
	const state = useOverlayTriggerState({})
	const openButtonRef = useRef<HTMLButtonElement>(null)
	const { triggerProps, overlayProps } = useOverlayTrigger(
		{ type: 'dialog' },
		state,
		openButtonRef
	)

	const triggerButton = useMemo(
		() =>
			trigger({
				onPress: () => {
					state.open()
				},
				ref: openButtonRef,
				...triggerProps,
			}),
		[openButtonRef, triggerProps, trigger, state]
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
					{typeof children === 'function'
						? children(() => state.close())
						: children}
				</Popover>
			)}
		</>
	)
}
