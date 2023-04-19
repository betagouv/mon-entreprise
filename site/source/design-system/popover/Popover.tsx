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
import React, { RefObject, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css, keyframes } from 'styled-components'

import { Grid } from '@/design-system/layout'
import { getIframeOffset, wrapperDebounceEvents } from '@/utils'

import { Container } from '../layout'
import { H2 } from '../typography/heading'

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
			titleProps?: {
				[key: string]: unknown
			}
			small?: boolean
			contentRef?: RefObject<HTMLDivElement>
			onClose?: () => void
			isDismissable?: boolean
			isOpen?: boolean
		}
) {
	const {
		title,
		children,
		small,
		contentRef,
		titleProps: titlePropsFromProps,
	} = props

	const { t } = useTranslation()

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
		<OverlayContainer
			aria-modal={true}
			role="dialog"
			aria-label={t('Fond de la boite de dialogue')}
		>
			<Underlay {...underlayProps} $offsetTop={offsetTop}>
				<Container>
					<Grid
						container
						css={`
							justify-content: center;
						`}
					>
						<Grid
							item
							sm={small ? 10 : 12}
							md={small ? 8 : 12}
							css={`
								min-width: 0;
							`}
						>
							{/* 
								If you use an iframe in the children, be careful because you need a
								focusable element before and after the iframe for the FocusTrap to work.
								The CloseButton counts as the before element, so you just need a focusable element after the iframe.
							*/}
							<FocusTrap>
								<PopoverContainer
									{...dialogProps}
									{...modalProps}
									{...overlayProps}
									$offsetTop={offsetTop}
									ref={ref}
									aria-label={title || t('Boite de dialogue')}
									title="modal"
								>
									{props.isDismissable && (
										<CloseButtonContainer>
											{/* TODO : replace with Link when in design system */}
											<CloseButton {...closeButtonProps} ref={closeButtonRef}>
												Fermer
												<svg
													role="img"
													aria-hidden
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

									<PopoverContent ref={contentRef}>
										{title && (
											<StyledH2 {...titleProps} {...titlePropsFromProps}>
												{title}
											</StyledH2>
										)}
										{children}
									</PopoverContent>
								</PopoverContainer>
							</FocusTrap>
						</Grid>
					</Grid>
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
	height: ${({ theme }) => theme.spacings.xxl};
	justify-content: flex-end;
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
	:hover {
		text-decoration: underline;
	}
`

const PopoverContent = styled.div`
	overflow: auto;
	padding: 0 ${({ theme }) => theme.spacings.xxl + ' ' + theme.spacings.md};
`

const StyledH2 = styled(H2)`
	&:after {
		content: '';
		border: none;
		height: 0;
	}
`
