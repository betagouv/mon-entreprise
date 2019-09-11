import FocusTrap from 'focus-trap-react'
import React from 'react'
import * as animate from 'Ui/animate'
import { LinkButton } from 'Ui/Button'
import './Overlay.css'
export default function Overlay({ onClose, children, ...otherProps }) {
	return (
		<div id="overlayWrapper">
			<animate.fromBottom>
				<FocusTrap
					focusTrapOptions={{
						onDeactivate: onClose,
						clickOutsideDeactivates: true
					}}>
					<div aria-modal="true" id="overlayContent" {...otherProps}>
						{children}
						<LinkButton
							aria-label="close"
							onClick={onClose}
							id="overlayCloseButton">
							×
						</LinkButton>
					</div>
				</FocusTrap>
			</animate.fromBottom>
		</div>
	)
}
