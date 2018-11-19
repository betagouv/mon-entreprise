import HoverDecorator from 'Components/utils/HoverDecorator'
import { compose } from 'ramda'
import React, { Component } from 'react'
import { Trans, withI18n } from 'react-i18next'
import './IgnoreStepButton.css'
import withColours from 'Components/utils/withColours'

export default compose(
	HoverDecorator,
	withI18n(),
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
				<div id="ignore">
					<a
						id="ignoreButton"
						style={do {
							let color = this.props.colours.textColourOnWhite
							;({ color, borderBottom: '1px solid ' + color })
						}}
						onClick={this.props.action}>
						<Trans>passer</Trans>
					</a>
					<span
						className="keyIcon"
						style={{ opacity: this.props.hover ? 1 : 0 }}>
						<Trans>Échap</Trans>
					</span>
				</div>
			)
		}
	}
)
