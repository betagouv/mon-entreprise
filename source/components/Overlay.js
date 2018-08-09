import FocusTrap from 'focus-trap-react'
import React, { Component } from 'react'
import * as animate from 'Ui/animate'
import { LinkButton } from 'Ui/Button'
import './Overlay.css'
export default class Overlay extends Component {
	render() {
		const { onClose, children, ...otherProps } = this.props
		return (
			<div id="overlayWrapper" onClick={onClose}>
				<animate.fromBottom>
					<FocusTrap
						focusTrapOptions={{
							onDeactivate: onClose,
							clickOutsideDeactivates: true
						}}>
						<div
							aria-modal="true"
							id="overlayContent"
							{...otherProps}
							onClick={e => {
								e.preventDefault()
								e.stopPropagation()
							}}>
							{children}
							<LinkButton
								aria-label="close"
								onClick={onClose}
								id="overlayCloseButton">
								x
							</LinkButton>
						</div>
					</FocusTrap>
				</animate.fromBottom>
			</div>
		)
	}
}
