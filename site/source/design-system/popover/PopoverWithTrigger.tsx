import { useOverlayTrigger } from '@react-aria/overlays'
import { useOverlayTriggerState } from '@react-stately/overlays'
import { AriaButtonProps } from '@react-types/button'
import React, {
	Attributes,
	ReactElement,
	Ref,
	RefObject,
	useEffect,
	useRef,
} from 'react'
import { useLocation } from 'react-router-dom'

import { ForceThemeProvider } from '@/components/utils/DarkModeContext'
import { Button } from '@/design-system/buttons'
import { omit } from '@/utils'

import { Link } from '../typography/link'
import Popover from './Popover'

type ButtonBuilderProps = AriaButtonProps & {
	ref: Ref<HTMLButtonElement>
}

export type PopoverWithTriggerProps = {
	trigger: (
		propsToDispatch: ButtonBuilderProps
	) => ReactElement<typeof Button> | ReactElement<typeof Link>
	children: React.ReactNode | ((close: () => void) => React.ReactNode)
	title?: string
	titleProps?: {
		[key: string]: unknown
	}
	small?: boolean
	contentRef?: RefObject<HTMLDivElement>
}

export default function PopoverWithTrigger({
	children,
	title,
	titleProps,
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

	const triggerButton = trigger({
		onPress: () => {
			state.open()
		},
		ref: openButtonRef,
		...omit(triggerProps, 'onPress'),
	})

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
				<ForceThemeProvider forceTheme="default">
					<Popover
						{...overlayProps}
						title={title}
						titleProps={titleProps}
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
