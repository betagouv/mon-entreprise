import FocusTrap from 'focus-trap-react'
import React, { useEffect } from 'react'
import styled from 'styled-components'

type ModalProps = React.HTMLAttributes<HTMLDivElement> & {
	onClose?: () => void
	children: React.ReactNode
}

export default function Modal({
	onClose,
	children,
	className,
	...otherProps
}: ModalProps) {
	useEffect(() => {
		const body = document.getElementsByTagName('body')[0]
		body.classList.add('no-scroll')
		return () => {
			body.classList.remove('no-scroll')
		}
	}, [])
	return (
		<StyledModalWrapper>
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
						<button
							aria-label="close"
							onClick={onClose}
							className="overlayCloseButton"
						>
							×
						</button>
					)}
				</div>
			</FocusTrap>
		</StyledModalWrapper>
	)
}

const StyledModalWrapper = styled.div`
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(255, 255, 255, 0.9);
	overflow: auto;
	z-index: 1;

	.overlayContent {
		position: absolute;
		padding-bottom: 1rem;
		min-height: 6em;
	}
	.overlayContent > * {
		animation: fromBottom 0.4s;
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
			transform: translateX(-50%);
			top: 100px;
			left: 50%;
			width: 80%;
			max-width: 40em;
		}
	}
	@keyframes fromBottom {
		from {
			transform: translateY(-10px);
			opacity: 0;
		}
		to {
			transform: translateY(0);
			opacity: 1;
		}
	}
`
