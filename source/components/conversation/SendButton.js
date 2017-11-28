import React, {Component} from 'react'
import HoverDecorator from 'Components/HoverDecorator'

@HoverDecorator
export default class SendButton extends Component {
	getAction(){
		let {sendButtonDisabled, error, submit } = this.props
		return () => (!sendButtonDisabled && !error ? submit() : null)
	}
	render() {
		let { sendButtonDisabled, themeColours, hover } = this.props
		return (
			<span className="sendWrapper">
				<button
					className="send"
					disabled={sendButtonDisabled}
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
					style={{ opacity: hover && !sendButtonDisabled ? 1 : 0 }}
				>
					Entrée{' '}↵
				</span>
			</span>
		)
	}
}
