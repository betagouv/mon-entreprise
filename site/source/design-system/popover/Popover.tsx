import { useButton } from '@react-aria/button'
import { useDialog } from '@react-aria/dialog'
import {
	OverlayContainer,
	OverlayProps,
	useModal,
	useOverlay,
	usePreventScroll,
} from '@react-aria/overlays'
import { AriaDialogProps } from '@react-types/dialog'
import FocusTrap from 'focus-trap-react'
import React, { RefObject, useRef } from 'react'
import { css, keyframes, styled } from 'styled-components'

import { FromBottom } from '@/components/ui/animate'
import { wrapperDebounceEvents } from '@/utils'

import { FocusStyle } from '../global-style'
import { useIFrameOffset } from '../hooks'
import { CrossIcon } from '../icons'
import { Container, Grid } from '../layout'
import { H1 } from '../typography/heading'

export function Popover(
	props: OverlayProps &
		AriaDialogProps & {
			children: React.ReactNode
			title?: string
			ariaLabel?: string
			small?: boolean
			contentRef?: RefObject<HTMLDivElement>
			onClose?: () => void
			isDismissable?: boolean
			isOpen?: boolean
			disableOverflowAuto?: boolean
		}
) {
	const { title, ariaLabel, children, small, contentRef } = props

	// Handle interacting outside the dialog and pressing
	// the Escape key to close the modal.
	const ref = useRef(null)
	const { overlayProps, underlayProps } = useOverlay(
		{ isOpen: true, ...props },
		ref
	)
	// Prevent scrolling while the modal is open, and hide content
	// outside the modal from screen readers.
	usePreventScroll()
	const { modalProps } = useModal()

	// Get props for the dialog and its title
	const { dialogProps, titleProps } = useDialog(props, ref)

	// Get props for the close button
	const closeButtonRef = useRef<HTMLButtonElement>(null)
	const { buttonProps: closeButtonProps } = useButton(
		wrapperDebounceEvents({ onPress: props.onClose }),
		closeButtonRef
	)

	const offsetTop = useIFrameOffset()
	if (offsetTop === undefined) {
		return null
	}

	return (
		<OverlayContainer>
			<Underlay {...underlayProps} $offsetTop={offsetTop}>
				<FromBottom>
					<Container backgroundColor={() => 'transparent'}>
						<Grid
							container
							style={{
								justifyContent: 'center',
							}}
						>
							<Grid
								item
								xs={12}
								sm={small ? 10 : 12}
								md={small ? 8 : 12}
								style={{
									minWidth: '0',
								}}
							>
								{/*
								If you use an iframe in the children, be careful because you need a
								focusable element before and after the iframe for the FocusTrap to work.
								The CloseButton counts as the before element, so you just need a focusable element after the iframe.
							*/}
								<FocusTrap
									focusTrapOptions={{
										clickOutsideDeactivates: true,
										escapeDeactivates: false,
									}}
								>
									<PopoverContainer
										{...dialogProps}
										{...modalProps}
										{...overlayProps}
										$offsetTop={offsetTop}
										ref={ref}
										aria-label={ariaLabel || title}
										data-cy="modal"
										aria-modal={true}
									>
										{props.isDismissable && (
											<CloseButtonContainer>
												{/* TODO : replace with Link when in design system */}
												<CloseButton {...closeButtonProps} ref={closeButtonRef}>
													Fermer
													<CrossIcon />
												</CloseButton>
											</CloseButtonContainer>
										)}

										<PopoverContent
											ref={contentRef}
											$disableOverflowAuto={props.disableOverflowAuto ?? false}
										>
											{title && <H1 {...titleProps}>{title}</H1>}
											{children}
										</PopoverContent>
									</PopoverContainer>
								</FocusTrap>
							</Grid>
						</Grid>
					</Container>
				</FromBottom>
			</Underlay>
		</OverlayContainer>
	)
}

const appear = keyframes`
	from { opacity: 0%}
	to { opacity: 100%}
`
const fromtop = keyframes`
	from { transform: translateY(-10px)}
	to { transform: translateY(0px)}
`

type UnderlayProps = { $offsetTop: number | null }
const Underlay = styled.div<UnderlayProps>`
	position: fixed;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	overflow: visible;
	z-index: 200; // to be in front of the menu of the Publicodes doc
	background: rgba(0, 0, 0, 0.5);
	animation: ${appear} 0.2s;
	display: flex;
	${({ $offsetTop }) =>
		$offsetTop === null &&
		css`
			align-items: center;
			@media (max-width: ${({ theme }) => theme.breakpointsWidth.sm}) {
				align-items: flex-end;
			}
		`}
`

const PopoverContainer = styled.div<{ $offsetTop: number | null }>`
	max-height: 90vh;

	background: ${({ theme }) =>
		theme.darkMode
			? theme.colors.extended.dark[600]
			: theme.colors.extended.grey[100]};
	box-shadow: ${({ theme }) => theme.elevations[4]};
	display: flex;
	margin-bottom: 1rem;
	flex-direction: column;
	animation: ${fromtop} 0.2s;

	${({ theme, $offsetTop }) =>
		$offsetTop
			? css`
					position: relative;
					top: ${$offsetTop}px;
					@media (min-width: ${theme.breakpointsWidth.md}) {
						margin-top: ${theme.spacings.xl};
					}
			  `
			: css`
					@media (max-width: ${theme.breakpointsWidth.sm}) {
						margin: 0 -16px;
					}
			  `}
`

export const CloseButtonContainer = styled.div`
	border-bottom: 1px solid ${({ theme }) => theme.colors.extended.grey[300]};
	${({ theme }) =>
		theme.darkMode &&
		css`
			color: ${theme.colors.extended.grey[100]};
		`}
	display: flex;
	align-items: center;
	justify-content: flex-end;
	background-color: ${({ theme }) =>
		theme.darkMode
			? theme.colors.extended.dark[600]
			: theme.colors.extended.grey[100]};
`

export const CloseButton = styled.button`
	display: inline-flex;
	align-items: center;

	background: inherit;
	border: none;

	color: ${({ theme }) =>
		theme.darkMode
			? theme.colors.bases.primary[100]
			: theme.colors.bases.primary[700]};
	font-family: ${({ theme }) => theme.fonts.main};
	font-weight: 700;
	font-size: ${({ theme }) => theme.baseFontSize};
	line-height: 24px;
	padding: ${({ theme }) => theme.spacings.sm};
	svg {
		width: ${({ theme }) => theme.spacings.lg};
		height: ${({ theme }) => theme.spacings.lg};
		fill: ${({ theme }) =>
			theme.darkMode
				? theme.colors.extended.grey[100]
				: theme.colors.bases.primary[700]};
	}
	&:hover {
		text-decoration: underline;
	}
	&:focus {
		${FocusStyle}
		box-shadow:  inset 0 0 0 3px #ffffff;
		outline-offset: -2px;
	}
`

const PopoverContent = styled.div<{ $disableOverflowAuto: boolean }>`
	${({ $disableOverflowAuto }) =>
		$disableOverflowAuto ? '' : 'overflow: auto;'}
	padding: 0 ${({ theme }) => theme.spacings.xxl + ' ' + theme.spacings.md};

	@media (max-width: ${({ theme }) => theme.breakpointsWidth.sm}) {
		padding: 0 ${({ theme }) => theme.spacings.md + ' ' + theme.spacings.md};
	}
`
