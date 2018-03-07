import React, { Component } from 'react'
import HoverDecorator from 'Components/HoverDecorator'
import I18n from 'i18n-js'

@HoverDecorator
export default class SendButton extends Component {
	getAction() {
		let { disabled, submit } = this.props
		return (cause) => (!disabled ? submit(cause) : null)
	}
	componentDidMount() {
		// removeEventListener will need the exact same function instance
		this.boundHandleKeyDown = this.handleKeyDown.bind(this)

		window.addEventListener('keydown', this.boundHandleKeyDown)
	}
	componentWillUnmount() {
		window.removeEventListener('keydown', this.boundHandleKeyDown)
	}
	handleKeyDown({ key }) {
		if (key !== 'Enter') return
		this.getAction()('enter')
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
					onClick={(event) => this.getAction()('accept')}
				>
					<span className="text" translate="yes">valider</span>
					<i className="fa fa-check" aria-hidden="true" />
				</button>
				<span
					translate="yes"
					className="keyIcon"
					style={{ opacity: hover && !disabled ? 1 : 0 }}
				>
					Entrée ↵
				</span>
			</span>
		)
	}
}
