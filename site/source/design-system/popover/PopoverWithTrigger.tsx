import { useOverlayTrigger } from '@react-aria/overlays'
import { useOverlayTriggerState } from '@react-stately/overlays'
import { AriaButtonProps } from '@react-types/button'
import React, {
	ReactElement,
	Ref,
	RefObject,
	useEffect,
	useMemo,
	useRef,
} from 'react'
import { useLocation } from 'react-router-dom'

import { Button } from '@/design-system/buttons'

import { Link } from '../typography/link'
import Popover from './Popover'

type ButtonBuilderProps = AriaButtonProps & {
	ref: Ref<HTMLButtonElement>
}

type PopoverWithTriggerProps = {
	trigger: (
		propsToDispatch: ButtonBuilderProps
	) => ReactElement<typeof Button> | ReactElement<typeof Link>
	children: React.ReactNode | ((close: () => void) => React.ReactNode)
	title?: string
	small?: boolean
	contentRef?: RefObject<HTMLDivElement>
}

export default function PopoverWithTrigger({
	children,
	title,
	trigger,
	small,
	contentRef,
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

	const { pathname } = useLocation()
	const pathnameRef = useRef(pathname)
	useEffect(() => {
		if (pathname !== pathnameRef.current) {
			pathnameRef.current = pathname
			state.close()
		}
	}, [pathname, state])

	return (
		<>
			{triggerButton}
			{state.isOpen && (
				<Popover
					{...overlayProps}
					title={title}
					onClose={() => state.close()}
					isDismissable
					role="dialog"
					small={small}
					contentRef={contentRef}
				>
					{typeof children === 'function'
						? children(() => state.close())
						: children}
				</Popover>
			)}
		</>
	)
}
