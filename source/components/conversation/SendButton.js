import HoverDecorator from 'Components/utils/HoverDecorator'
import withColours from 'Components/utils/withColours'
import { compose } from 'ramda'
import React, { Component } from 'react'
import { Trans, withNamespaces } from 'react-i18next'

export default compose(
	HoverDecorator,
	withNamespaces(),
	withColours
)(
	class SendButton extends Component {
		getAction() {
			let { disabled, submit } = this.props
			return cause => (!disabled ? submit(cause) : null)
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
			let { disabled, colours, hover } = this.props
			return (
				<span className="sendWrapper">
					<button
						className="send"
						disabled={disabled}
						style={{
							color: colours.textColour,
							background: colours.colour
						}}
						onClick={() => this.getAction()('accept')}>
						<span className="text">
							<Trans>valider</Trans> ✓
						</span>
					</button>
					<span
						className="keyIcon"
						style={{ opacity: hover && !disabled ? 1 : 0 }}>
						<Trans>Entrée</Trans> ↵
					</span>
				</span>
			)
		}
	}
)
