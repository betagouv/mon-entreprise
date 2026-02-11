import { useOverlayTrigger } from '@react-aria/overlays'
import { useOverlayTriggerState } from '@react-stately/overlays'
import { AriaButtonProps } from '@react-types/button'
import React, { ReactElement, Ref, RefObject, useEffect, useRef } from 'react'

import { ForceThemeProvider } from '@/components/utils/DarkModeContext'
import { useNavigation } from '@/lib/navigation'
import { omit } from '@/utils'

import { Button } from '../buttons'
import { Link } from '../typography/link'
import { Popover } from './Popover'

type ButtonBuilderProps = AriaButtonProps & {
	ref: Ref<HTMLButtonElement>
}

export type PopoverWithTriggerProps = {
	trigger: (
		propsToDispatch: ButtonBuilderProps
	) => ReactElement<typeof Button> | ReactElement<typeof Link>
	children: React.ReactNode | ((close: () => void) => React.ReactNode)
	title?: string
	ariaLabel?: string
	small?: boolean
	contentRef?: RefObject<HTMLDivElement>
	disableOverflowAuto?: boolean
}

export function PopoverWithTrigger({
	children,
	title,
	ariaLabel,
	trigger,
	small,
	contentRef,
	disableOverflowAuto,
}: PopoverWithTriggerProps) {
	const state = useOverlayTriggerState({})
	const openButtonRef = useRef<HTMLButtonElement>(null)
	const { triggerProps, overlayProps } = useOverlayTrigger(
		{ type: 'dialog' },
		state,
		openButtonRef
	)

	const triggerButton = trigger({
		onPress: () => {
			state.open()
		},
		ref: openButtonRef,
		...omit(triggerProps, 'onPress'),
	})

	const { currentPath } = useNavigation()
	const pathnameRef = useRef(currentPath)
	useEffect(() => {
		if (currentPath !== pathnameRef.current) {
			pathnameRef.current = currentPath
			state.close()
		}
	}, [currentPath, state])

	return (
		<>
			{triggerButton}
			{state.isOpen && (
				<ForceThemeProvider forceTheme="default">
					<Popover
						{...overlayProps}
						disableOverflowAuto={disableOverflowAuto}
						title={title}
						ariaLabel={ariaLabel}
						onClose={() => {
							state.close()
						}}
						isDismissable
						role="dialog"
						small={small}
						contentRef={contentRef}
					>
						{typeof children === 'function'
							? children(() => {
									state.close()
							  })
							: children}
					</Popover>
				</ForceThemeProvider>
			)}
		</>
	)
}
