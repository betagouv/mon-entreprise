import withColours from 'Components/utils/withColours'
import { compose } from 'ramda'
import React, { Component } from 'react'
import { Trans, withTranslation } from 'react-i18next'

export default compose(
	withTranslation(),
	withColours
)(
	class IgnoreStepButton extends Component {
		componentDidMount() {
			// removeEventListener will need the exact same function instance
			this.boundHandleKeyDown = this.handleKeyDown.bind(this)

			window.addEventListener('keydown', this.boundHandleKeyDown)
		}
		handleKeyDown({ key }) {
			if (key !== 'Escape') return
			document.activeElement.blur()
			this.props.action()
		}
		componentWillUnmount() {
			window.removeEventListener('keydown', this.boundHandleKeyDown)
		}
		render() {
			return (
				<div
					css={`
						position: relative;
						text-align: right;

						.keyIcon {
							opacity: 0;
						}
						:hover .keyIcon {
							opacity: 1;
						}
					`}>
					<button
						className="ui__  small simple skip button"
						onClick={this.props.action}>
						<Trans>passer</Trans> →
					</button>
					<span className="keyIcon">
						<Trans>Échap</Trans>
					</span>
				</div>
			)
		}
	}
)
