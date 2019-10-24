import FocusTrap from 'focus-trap-react'
import React, { useEffect } from 'react'
import * as animate from 'Ui/animate'
import { LinkButton } from 'Ui/Button'
import './Overlay.css'
export default function Overlay({ onClose, children, ...otherProps }) {
	useEffect(() => {
		const body = document.getElementsByTagName('body')[0]
		body.classList.add('no-scroll');
		return () => {
			body.classList.remove('no-scroll')
		}
	}
		, [])
	return (
		<div id="overlayWrapper">
			<animate.fromBottom>
				<FocusTrap
					focusTrapOptions={{
						onDeactivate: onClose,
						clickOutsideDeactivates: !!onClose
					}}>
					<div
						aria-modal="true"
						id="overlayContent"
						{...otherProps}
						className={'ui__ card ' + otherProps.className}>
						{children}
						{onClose && (
							<LinkButton
								aria-label="close"
								onClick={onClose}
								id="overlayCloseButton">
								×
							</LinkButton>
						)}
					</div>
				</FocusTrap>
			</animate.fromBottom>
		</div>
	)
}
