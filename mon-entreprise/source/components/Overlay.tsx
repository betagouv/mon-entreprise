import * as animate from 'Components/ui/animate'
import { LinkButton } from 'Components/ui/Button'
import FocusTrap from 'focus-trap-react'
import React, { useEffect } from 'react'
import './Overlay.css'

type OverlayProps = React.HTMLAttributes<HTMLDivElement> & {
	onClose?: () => void
	children: React.ReactNode
}

export default function Overlay({
	onClose,
	children,
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
		<div id="overlayWrapper">
			<animate.fromBottom>
				<FocusTrap
					focusTrapOptions={{
						onDeactivate: onClose,
						clickOutsideDeactivates: !!onClose
					}}
				>
					<div
						aria-modal="true"
						id="overlayContent"
						{...otherProps}
						className={'ui__ card ' + otherProps?.className}
					>
						{children}
						{onClose && (
							<LinkButton
								aria-label="close"
								onClick={onClose}
								id="overlayCloseButton"
							>
								×
							</LinkButton>
						)}
					</div>
				</FocusTrap>
			</animate.fromBottom>
		</div>
	)
}
