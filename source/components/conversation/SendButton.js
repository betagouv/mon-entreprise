import { compose } from 'ramda'
import React, { Component } from 'react'
import { Trans, withTranslation } from 'react-i18next'

export default compose(withTranslation())(
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
			let { disabled } = this.props
			return (
				<button
					className="ui__ button plain"
					css="margin-left: 1.2rem"
					disabled={disabled}
					onClick={() => this.getAction()('accept')}>
					<span className="text">
						<Trans>Suivant</Trans> →
					</span>
				</button>
			)
		}
	}
)
