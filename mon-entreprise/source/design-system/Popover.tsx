import { useDialog } from '@react-aria/dialog'
import { FocusScope } from '@react-aria/focus'
import {
	OverlayContainer,
	OverlayProps,
	useModal,
	useOverlay,
	usePreventScroll,
} from '@react-aria/overlays'
import { AriaDialogProps } from '@react-types/dialog'
import React, { useRef } from 'react'
import styled, { keyframes } from 'styled-components'
import { Container } from './layout'
import { H2 } from './typography/heading'

export default function Popover(
	props: OverlayProps &
		AriaDialogProps & { children: React.ReactNode; title?: string }
) {
	const { title, children } = props

	// Handle interacting outside the dialog and pressing
	// the Escape key to close the modal.
	const ref = useRef(null)
	const { overlayProps, underlayProps } = useOverlay(props, ref)

	// Prevent scrolling while the modal is open, and hide content
	// outside the modal from screen readers.
	usePreventScroll()
	const { modalProps } = useModal()

	// Get props for the dialog and its title
	const { dialogProps, titleProps } = useDialog(props, ref)

	// Get props for the close button
	const closeButtonRef = useRef(null)

	return (
		<OverlayContainer>
			<Underlay {...underlayProps}>
				<Container>
					<FocusScope contain restoreFocus autoFocus>
						<PopoverContainer
							{...overlayProps}
							{...dialogProps}
							{...modalProps}
							ref={ref}
						>
							{props.isDismissable && (
								<CloseButtonContainer>
									{/* TODO : replace with Link when in design system */}
									<CloseButton onClick={props.onClose} ref={closeButtonRef}>
										Fermer
										<svg
											viewBox="0 0 24 24"
											fill="none"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path
												fillRule="evenodd"
												clipRule="evenodd"
												d="M6.69323 17.2996C6.30271 16.9091 6.30271 16.276 6.69323 15.8854L15.8856 6.69304C16.2761 6.30252 16.9093 6.30252 17.2998 6.69304C17.6904 7.08356 17.6904 7.71673 17.2998 8.10725L8.10744 17.2996C7.71692 17.6902 7.08375 17.6902 6.69323 17.2996Z"
											/>
											<path
												fillRule="evenodd"
												clipRule="evenodd"
												d="M6.6635 6.69306C7.05402 6.30254 7.68719 6.30254 8.07771 6.69306L17.2701 15.8854C17.6606 16.276 17.6606 16.9091 17.2701 17.2997C16.8796 17.6902 16.2464 17.6902 15.8559 17.2997L6.6635 8.10727C6.27297 7.71675 6.27297 7.08359 6.6635 6.69306Z"
											/>
										</svg>
									</CloseButton>
								</CloseButtonContainer>
							)}
							<PopoverContent>
								{title && (
									<H2 as="h1" {...titleProps}>
										{title}
									</H2>
								)}
								{children}
							</PopoverContent>
						</PopoverContainer>
					</FocusScope>
				</Container>
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
const Underlay = styled.div`
	position: fixed;
	top: 0;
	left: 0;
	bottom: 0;
	right: 0;
	overflow: auto;
	z-index: 2;
	background: rgba(255, 255, 255, 0.5);
	display: flex;
	align-items: center;
	animation: ${appear} 0.2s;
`

const PopoverContainer = styled.div`
	background: ${({ theme }) => theme.colors.extended.grey[100]};
	box-shadow: ${({ theme }) => theme.elevations[4]};
	display: flex;

	flex-direction: column;
	@media (max-width: ${({ theme }) => theme.breakpointsWidth.sm}) {
		flex-direction: column-reverse;
	}
	animation: ${fromtop} 0.2s;
`
const CloseButtonContainer = styled.div`
	border-bottom: 1px solid ${({ theme }) => theme.colors.extended.grey[300]};
	@media (max-width: ${({ theme }) => theme.breakpointsWidth.sm}) {
		border-top: 1px solid ${({ theme }) => theme.colors.extended.grey[300]};
		position: sticky;
		bottom: 0;
		background: ${({ theme }) => theme.colors.extended.grey[100]};
	}
	display: flex;
	align-items: center;
	height: ${({ theme }) => theme.spacings.xxl};
	justify-content: flex-end;
`
const CloseButton = styled.button`
	display: inline-flex;
	align-items: center;
	color: ${({ theme }) => theme.colors.bases.primary[700]};
	font-family: ${({ theme }) => theme.fonts.main};
	font-weight: 700;
	font-size: ${({ theme }) => theme.baseFontSize};
	line-height: 24px;
	padding: ${({ theme }) => theme.spacings.sm};
	path {
		fill: ${({ theme }) => theme.colors.bases.primary[700]};
	}
	svg {
		width: ${({ theme }) => theme.spacings.lg};
		height: ${({ theme }) => theme.spacings.lg};
	}
	:hover {
		text-decoration: underline;
	}
`

const PopoverContent = styled.div`
	padding: ${({ theme }) => theme.spacings.xxl};
	padding-top: ${({ theme }) => theme.spacings.lg};
`
