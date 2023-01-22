import FocusTrap from 'focus-trap-react'
import React, { ReactNode, useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import { Trans } from 'react-i18next'
import styled, { css } from 'styled-components'

import { Button } from '../buttons'
import { Grid } from '../layout'
import { CloseButton, CloseButtonContainer } from '../popover/Popover'

export const Drawer = ({
	trigger,
	children,
	onConfirm,
	confirmLabel,
	cancelLabel,
	isDismissable = true,
}: {
	trigger: ReactNode
	children: ReactNode
	confirmLabel?: string
	cancelLabel?: string
	onConfirm: () => void
	isDismissable?: boolean
}) => {
	const [isOpen, setIsOpen] = useState(false)
	const [isMounted, setIsMounted] = useState(false)

	const openDrawer = () => {
		setIsMounted(true)
	}

	// Avoid scroll jump
	const disablePageScrolling = (shouldDisableScroll: boolean) => {
		if (shouldDisableScroll) {
			document.body.style.top = `-${window.scrollY}px`
			document.body.style.position = 'fixed'
		} else {
			const scrollY = document.body.style.top
			document.body.style.position = ''
			document.body.style.top = ''
			window.scrollTo(0, parseInt(scrollY || '0') * -1)
		}
	}

	useEffect(() => {
		if (isMounted) {
			setIsOpen(true)
			disablePageScrolling(true)
		}
	}, [isMounted])

	const closeDrawer = () => {
		setIsOpen(false)

		setTimeout(() => {
			disablePageScrolling(false)
			setIsMounted(false)
		}, 500)
	}

	return (
		<>
			{React.Children.map(trigger, (child) => {
				if (React.isValidElement(child)) {
					return React.cloneElement(child, { onClick: openDrawer } as {
						onClick: () => void
					})
				}
			})}
			{isMounted &&
				ReactDOM.createPortal(
					<DrawerContainer>
						<DrawerBackground $isOpen={isOpen} />
						<FocusTrap
							focusTrapOptions={{
								clickOutsideDeactivates: true,
								onDeactivate: closeDrawer,
							}}
						>
							<DrawerPanel $isOpen={isOpen} role="dialog">
								{isDismissable && (
									<StyledCloseButtonContainer>
										{/* TODO : replace with Link when in design system */}
										<CloseButton onClick={closeDrawer}>
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
									</StyledCloseButtonContainer>
								)}
								<DrawerContent>
									{React.Children.map(children, (child) => {
										if (React.isValidElement(child)) {
											return React.cloneElement(child, { closeDrawer } as {
												closeDrawer: () => void
											})
										}
									})}
								</DrawerContent>

								{onConfirm && (
									<DrawerFooter>
										<StyledGrid container>
											<Grid item>
												<Button light onPress={() => closeDrawer()}>
													{cancelLabel ?? <Trans>Annuler</Trans>}
												</Button>
											</Grid>
											<Grid item>
												<Button
													onPress={() => {
														closeDrawer()
														setTimeout(() => onConfirm())
													}}
												>
													{confirmLabel ?? <Trans>Confirmer</Trans>}
												</Button>
											</Grid>
										</StyledGrid>
									</DrawerFooter>
								)}
							</DrawerPanel>
						</FocusTrap>
					</DrawerContainer>,
					document.querySelector('body') as Element
				)}
		</>
	)
}

const DrawerContainer = styled.div`
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: 100;
`

const DrawerBackground = styled.div<{ $isOpen?: boolean }>`
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	transition: background-color 0.2s ease-in-out;
	background-color: ${({ $isOpen }) =>
		$isOpen ? 'rgba(0, 0, 0, 0.25)' : 'transparent'};
	overflow: hidden;
	cursor: pointer;
	width: 100vw;
	height: 100vh;
`
const DrawerPanel = styled.div<{
	$isOpen: boolean
}>`
	width: 500px;
	max-width: 100vw;
	height: 100vh;
	overflow-x: hidden;
	overflow-y: auto;
	background-color: ${({ theme }) => theme.colors.extended.grey[100]};
	transition: transform 0.5s ease-in-out;
	position: fixed;
	right: 0;
	top: 0;
	transform: translateX(100%);
	z-index: 10;
	${({ $isOpen }) =>
		$isOpen &&
		css`
			transform: translateX(0);
		`}
`

const DrawerContent = styled.div`
	padding: 0 ${({ theme }) => theme.spacings.xxl};
	padding-bottom: 2rem;
`

const DrawerFooter = styled.div`
	position: sticky;
	bottom: 0;
	left: 0;
	right: 0;
	background: ${({ theme }) => theme.colors.extended.grey[100]};
	padding: ${({ theme }) => theme.spacings.xl};
	box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.15);
	z-index: 10;
`

const StyledGrid = styled(Grid)`
	display: flex;
	justify-content: center;
	gap: ${({ theme }) => theme.spacings.md};
`

const StyledCloseButtonContainer = styled(CloseButtonContainer)`
	position: sticky;
	top: 0;
	left: 0;
	right: 0;
	background: ${({ theme }) => theme.colors.extended.grey[100]};
	z-index: 10;
`
