import { Button } from '@/design-system/buttons'
import { useOverlayTrigger } from '@react-aria/overlays'
import { useOverlayTriggerState } from '@react-stately/overlays'
import { useEffect, useMemo, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import styled from 'styled-components'
import { Grid } from '../layout'
import { Body } from '../typography/paragraphs'
import Popover from './Popover'
import { PopoverWithTriggerProps } from './PopoverWithTrigger'

type PopoverConfirm = Omit<PopoverWithTriggerProps, 'children'> & {
	cancelLabel?: string
	confirmLabel?: string
	onConfirm: () => void
	children?: Element
}

export default function PopoverConfirm({
	children,
	title,
	trigger,
	small,
	contentRef,
	cancelLabel = 'Annuler',
	confirmLabel = 'Confirmer',
	onConfirm,
}: PopoverConfirm) {
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
					<StyledContainer>
						<Body>{children}</Body>

						<StyledGrid container>
							<Grid item>
								<Button light onPress={() => state.close()}>
									{cancelLabel}
								</Button>
							</Grid>
							<Grid item>
								<Button
									onPress={() => {
										onConfirm()
										state.close()
									}}
								>
									{confirmLabel}
								</Button>
							</Grid>
						</StyledGrid>
					</StyledContainer>
				</Popover>
			)}
		</>
	)
}

const StyledGrid = styled(Grid)`
	display: flex;
	justify-content: center;
	gap: ${({ theme }) => theme.spacings.xl};
`

const StyledContainer = styled.div`
	padding: ${({ theme }) => theme.spacings.xxl};
`
