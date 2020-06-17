import * as animate from 'Components/ui/animate'
import { LinkButton } from 'Components/ui/Button'
import FocusTrap from 'focus-trap-react'
import React, { useEffect } from 'react'
import styled from 'styled-components'

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
					<div
						aria-modal="true"
						className={'ui__ card overlayContent ' + className ?? ''}
						{...otherProps}
					>
						{children}
						{onClose && (
							<LinkButton
								aria-label="close"
								onClick={onClose}
								className="overlayCloseButton"
							>
								×
							</LinkButton>
						)}
					</div>
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
		min-height: 6em;
	}
	.overlayCloseButton {
		position: absolute;
		top: 0rem;
		text-decoration: none;
		font-size: 200%;
		color: rgba(51, 51, 80, 0.8);
		right: 0.5rem;
	}
	@media (min-width: 600px) {
		.overlayContent {
			transform: translateX(-50%) translateY(10vh);
			top: 0;
			left: 50%;
			width: 80%;
			max-width: 40em;
		}
	}
`
