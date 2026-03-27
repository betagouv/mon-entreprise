import FocusTrap from 'focus-trap-react'
import { ReactNode, useCallback, useEffect, useRef, useState } from 'react'
import ReactDOM from 'react-dom'
import { Trans, useTranslation } from 'react-i18next'
import { css, styled } from 'styled-components'

import { useOnClickOutside } from '@/hooks/useOnClickOutside'
import { useOnKeyDown } from '@/hooks/useOnKeyDown'
import { useNavigation } from '@/lib/navigation'

import { Button } from '../buttons'
import { CrossIcon } from '../icons'
import { Grid } from '../layout'
import { CloseButton, CloseButtonContainer } from '../popover/Popover'

export type DrawerButtonProps = {
	onPress: () => void
	['aria-expanded']: boolean
	['aria-haspopup']:
		| boolean
		| 'dialog'
		| 'menu'
		| 'grid'
		| 'listbox'
		| 'tree'
		| 'true'
		| 'false'
		| undefined
}

export const Drawer = ({
	trigger,
	children,
	onConfirm,
	onCancel,
	confirmLabel,
	cancelLabel,
	isDismissable = true,
}: {
	trigger: (props: DrawerButtonProps) => ReactNode
	children: ReactNode
	confirmLabel?: string
	cancelLabel?: string
	onConfirm?: () => void
	onCancel?: () => void
	isDismissable?: boolean
}) => {
	const panel = useRef<HTMLDivElement>(null)
	const [isOpen, setIsOpen] = useState(false)
	const [isMounted, setIsMounted] = useState(false)
	const { t } = useTranslation()

	const openDrawer = () => {
		setIsMounted(true)
	}

	const disablePageScrolling = (shouldDisableScroll: boolean) => {
		if (shouldDisableScroll) {
			document.body.style.top = `-${window.scrollY}px`
			document.body.style.position = 'fixed'
		} else {
			const scrollY = document.body.style.top
			document.body.style.position = ''
			document.body.style.top = ''
			if (scrollY) {
				// Avoid scroll jump
				window.scrollTo(0, parseInt(scrollY) * -1)
			}
		}
	}

	useEffect(() => {
		if (isMounted) {
			setIsOpen(true)
			disablePageScrolling(true)
		}
	}, [isMounted])

	const closeDrawer = useCallback(
		(cancel: boolean) => {
			setIsOpen(false)
			disablePageScrolling(false)

			setTimeout(() => {
				setIsMounted(false)
				if (cancel && onCancel) {
					onCancel()
				}
			}, 500)
		},
		[onCancel]
	)

	useOnClickOutside(panel, () => {
		closeDrawer(true)
	})
	useOnKeyDown('Escape', () => {
		closeDrawer(true)
	})

	const { currentPath } = useNavigation()

	// close the drawer when the route change
	useEffect(() => {
		// if the drawer close unexpectedly cause of this effect, be sure to use useCallback for the onCancel prop
		closeDrawer(true)
	}, [currentPath])

	return (
		<>
			{trigger({
				'aria-expanded': isOpen,
				'aria-haspopup': 'dialog',
				onPress: openDrawer,
			})}
			{isMounted &&
				ReactDOM.createPortal(
					<DrawerContainer>
						<DrawerBackground $isOpen={isOpen} />
						<FocusTrap
							focusTrapOptions={{
								clickOutsideDeactivates: true,
								fallbackFocus: panel.current ?? undefined,
							}}
						>
							<DrawerPanel
								ref={panel}
								$isOpen={isOpen}
								role="dialog"
								aria-modal="true"
								aria-label={t('main-menu', 'Menu principal')}
							>
								{isDismissable && (
									<StyledCloseButtonContainer>
										{/* TODO : replace with Link when in design system */}
										<CloseButton onClick={() => closeDrawer(true)}>
											Fermer
											<CrossIcon />
										</CloseButton>
									</StyledCloseButtonContainer>
								)}

								<DrawerContentWrapper>
									<DrawerContent>{children}</DrawerContent>
								</DrawerContentWrapper>

								{onConfirm && (
									<DrawerFooter>
										<StyledGrid container>
											<Grid item>
												<Button light onPress={() => closeDrawer(true)}>
													{cancelLabel ?? <Trans>Annuler</Trans>}
												</Button>
											</Grid>
											<Grid item>
												<Button
													onPress={() => {
														onConfirm()
														setTimeout(() => closeDrawer(false), 200)
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
	width: 100vw;
	height: 100vh;
`

const DrawerBackground = styled.div<{ $isOpen?: boolean }>`
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	transition: background-color 0.4s ease-in-out;
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
	display: flex;
	flex-direction: column;
	width: 500px;
	max-width: 100vw;
	height: 100vh;
	background-color: ${({ theme }) =>
		theme.darkMode
			? theme.colors.extended.dark[600]
			: theme.colors.extended.grey[100]};
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

const DrawerContentWrapper = styled.div`
	overflow: auto;
	flex-grow: 1;
`

const DrawerContent = styled.div`
	padding: 0 ${({ theme }) => theme.spacings.xxl};
	padding-bottom: 2rem;
	min-height: 100%;
`

const DrawerFooter = styled.div`
	background-color: ${({ theme }) =>
		theme.darkMode
			? theme.colors.extended.dark[600]
			: theme.colors.extended.grey[100]};
	padding: ${({ theme }) => theme.spacings.xl};
	box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.15);
`

const StyledGrid = styled(Grid)`
	display: flex;
	justify-content: center;
	gap: ${({ theme }) => theme.spacings.md};
`

const StyledCloseButtonContainer = styled(CloseButtonContainer)``
