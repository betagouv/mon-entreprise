import React, { Component } from 'react'
import HoverDecorator from 'Components/HoverDecorator'

@HoverDecorator
export default class SendButton extends Component {
	getAction() {
		let { disabled, submit } = this.props
		return () => (!disabled ? submit() : null)
	}
	render() {
		let { disabled, themeColours, hover } = this.props
		return (
			<span className="sendWrapper">
				<button
					className="send"
					disabled={disabled}
					style={{
						color: themeColours.textColour,
						background: themeColours.colour
					}}
					onClick={this.getAction()}
				>
					<span className="text">valider</span>
					<span className="icon">&#10003;</span>
				</button>
				<span
					className="keyIcon"
					style={{ opacity: hover && !disabled ? 1 : 0 }}
				>
					Entrée ↵
				</span>
			</span>
		)
	}
}
