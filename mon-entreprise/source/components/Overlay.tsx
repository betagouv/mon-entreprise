import * as animate from 'Components/ui/animate'
import { LinkButton } from 'Components/ui/Button'
import FocusTrap from 'focus-trap-react'
import React, { useEffect } from 'react'
import styled, { css } from 'styled-components'
import { ScrollToElement, ScrollToTop } from './utils/Scroll'

type OverlayProps = React.HTMLAttributes<HTMLDivElement> & {
	onClose?: () => void
	children: React.ReactNode
}

export default function Overlay({
	onClose,
	children,
	className,
	...otherProps
}: OverlayProps) {
	useEffect(() => {
		const body = document.getElementsByTagName('body')[0]
		body.classList.add('no-scroll')
		return () => {
			body.classList.remove('no-scroll')
		}
	}, [])
	return (
		<StyledOverlayWrapper>
			<animate.fromBottom>
				<FocusTrap
					focusTrapOptions={{
						onDeactivate: onClose,
						clickOutsideDeactivates: !!onClose
					}}
				>
					<ScrollToElement>
						<div
							aria-modal="true"
							className={'ui__ card overlayContent ' + className ?? ''}
							{...otherProps}
						>
							{children}
							{onClose && (
								<LinkButton
									aria-label="Fermer"
									onClick={onClose}
									className="overlayCloseButton"
								>
									×
								</LinkButton>
							)}
						</div>
					</ScrollToElement>
				</FocusTrap>
			</animate.fromBottom>
		</StyledOverlayWrapper>
	)
}

const StyledOverlayWrapper = styled.div`
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(255, 255, 255, 0.9);
	overflow: auto;
	z-index: 2;
	.overlayContent {
		position: absolute;
		padding-bottom: 1rem;
		min-height: 100vh;
	}
	.overlayCloseButton {
		position: absolute;
		bottom: 0rem;
		text-decoration: none;
		font-size: 3rem;
		color: rgba(0, 0, 0, 0.6);
		color: var(--lighterTextColor);
		padding: 0 0.5rem;
		right: 0;
	}
	@media (min-width: 600px) {
		.overlayCloseButton {
			top: 0;
			bottom: initial;
			font-size: 2rem;
		}
		.overlayContent {
			transform: translateX(-50%) translateY(20vh);
			left: 50%;
			width: 80%;
			height: auto;
			max-width: 40em;
			min-height: 6em;
		}
	}
`
