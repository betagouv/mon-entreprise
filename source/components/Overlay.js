import FocusTrap from 'focus-trap-react'
import React, { Component } from 'react'
import './Overlay.css'

export default class Overlay extends Component {
	render() {
		const { onClose, children, otherProps } = this.props
		return (
			<div id="overlayWrapper" onClick={onClose}>
				<FocusTrap
					focusTrapOptions={{
						onDeactivate: onClose
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
						<button
							aria-label="close"
							onClick={onClose}
							className="unstyledButton"
							id="overlayCloseButton">
							x
						</button>
					</div>
				</FocusTrap>
			</div>
		)
	}
}
