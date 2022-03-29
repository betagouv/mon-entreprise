import { getIframeOffset, wrapperDebounceEvents } from '@/utils'
import { Grid } from '@mui/material'
import { useButton } from '@react-aria/button'
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
import React, { RefObject, useEffect, useRef, useState } from 'react'
import styled, { css, keyframes, ThemeProvider } from 'styled-components'
import { Container } from './layout'
import { H2 } from './typography/heading'

const useIFrameOffset = () => {
	const [offsetTop, setOffset] = useState<number | null | undefined>(
		window.parent !== window ? undefined : null
	)
	useEffect(() => {
		if (window.parent === window) {
			return
		}
		void getIframeOffset().then(setOffset)
	}, [])

	return offsetTop
}

export default function Popover(
	props: OverlayProps &
		AriaDialogProps & {
			children: React.ReactNode
			title?: string
			small?: boolean
			contentRef?: RefObject<HTMLDivElement>
		}
) {
	const { title, children, small, contentRef } = props

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
		<ThemeProvider theme={(theme) => ({ ...theme, darkMode: false })}>
			<OverlayContainer>
				<Underlay {...underlayProps} $offsetTop={offsetTop}>
					<Container>
						<Grid container justifyContent="center">
							<Grid item sm={small ? 10 : 12} md={small ? 8 : 12} zeroMinWidth>
								<PopoverContainer
									{...dialogProps}
									{...modalProps}
									{...overlayProps}
									$offsetTop={offsetTop}
									ref={ref}
								>
									<FocusScope contain restoreFocus autoFocus>
										{props.isDismissable && (
											<CloseButtonContainer>
												{/* TODO : replace with Link when in design system */}
												<CloseButton {...closeButtonProps} ref={closeButtonRef}>
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
										{/* tabIndex -1 is for text selection in popover, see https://github.com/adobe/react-spectrum/issues/1604#issuecomment-781574668 */}
										<PopoverContent tabIndex={-1} ref={contentRef}>
											{title && (
												<H2 as="h1" {...titleProps}>
													{title}
												</H2>
											)}
											{children}
										</PopoverContent>
									</FocusScope>
								</PopoverContainer>
							</Grid>
						</Grid>
					</Container>
				</Underlay>
			</OverlayContainer>
		</ThemeProvider>
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
const Underlay = styled.div<{
	$offsetTop: number | null
}>`
	position: fixed;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	overflow: auto;
	z-index: 10;
	background: rgba(255, 255, 255, 0.5);
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

	background: ${({ theme }) => theme.colors.extended.grey[100]};
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
const CloseButtonContainer = styled.div`
	border-bottom: 1px solid ${({ theme }) => theme.colors.extended.grey[300]};

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
	overflow: auto;
	padding: 0 ${({ theme }) => theme.spacings.xxl + ' ' + theme.spacings.md};
`
