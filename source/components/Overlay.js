import FocusTrap from 'focus-trap-react'
import React, { Component } from 'react'
import * as animate from 'Ui/animate'
import { LinkButton } from 'Ui/Button'
import './Overlay.css'
export default class Overlay extends Component {
	render() {
		const { onClose, children, ...otherProps } = this.props
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
}
