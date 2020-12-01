import FocusTrap from 'focus-trap-react'
import React, { useEffect, useState } from 'react'
import styled, { css } from 'styled-components'

type OverlayProps = React.HTMLAttributes<HTMLDivElement> & {
	onClose?: () => void
	xPosition?: number
	children: React.ReactNode
}
declare global {
	interface Window {
		parentIFrame?: any
	}
}

const useIFrameOffset = () => {
	const [offsetTop, setOffset] = useState<number | null>(null)
	useEffect(() => {
		if (!('parentIFrame' in window)) {
			setOffset(0)
			return
		}
		window.parentIFrame.getPageInfo(({ scrollTop, offsetTop }) => {
			setOffset(scrollTop - offsetTop)
			window.parentIFrame.getPageInfo(false)
		})
	}, [])
	return offsetTop
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
	const offsetTop = useIFrameOffset()
	if (offsetTop === null) {
		return null
	}
	return (
		<StyledOverlayWrapper offsetTop={offsetTop}>
			<div className="overlayContent">
				<FocusTrap
					focusTrapOptions={{
						onDeactivate: onClose,
						clickOutsideDeactivates: !!onClose,
					}}
				>
					<div
						aria-modal="true"
						className={'ui__ card  ' + className ?? ''}
						{...otherProps}
					>
						{children}
						{onClose && (
							<button
								aria-label="Fermer"
								onClick={onClose}
								className="overlayCloseButton"
							>
								×
							</button>
						)}
					</div>
				</FocusTrap>
			</div>
		</StyledOverlayWrapper>
	)
}

const StyledOverlayWrapper = styled.div<{ offsetTop: number | null }>`
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(255, 255, 255, 0.9);
	overflow: auto;
	z-index: 2;
	.overlayContent {
		${({ offsetTop }) =>
			offsetTop
				? css`
						transform: translateY(${offsetTop}px);
				  `
				: css`
						bottom: 0;
						max-height: 80vh;
				  `}
		position: absolute;
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
	.ui__.card[aria-modal='true'] {
		padding-bottom: 4rem;
		display: flex;
		flex-direction: column;
	}

	@media (min-width: 600px) {
		.overlayCloseButton {
			top: 0;
			bottom: auto;
			font-size: 2rem;
		}
		.overlayContent {
			transform: translateX(-50%)
				translateY(calc(${({ offsetTop }) => offsetTop}px + 10rem));
			left: 50%;
			width: 80%;
			bottom: auto;
			height: auto;
			max-width: 40em;
			min-height: 6em;
		}
	.ui__.card[aria-modal='true'] {
		padding-bottom: 2rem;
		margin-bottom: 2rem;
	}
`
