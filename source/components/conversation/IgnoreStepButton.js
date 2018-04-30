import React, { Component } from 'react'
import { Trans, translate } from 'react-i18next'
import './IgnoreStepButton.css'
import HoverDecorator from 'Components/HoverDecorator'

@HoverDecorator
@translate()
export default class IgnoreStepButton extends Component {
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
				<a id="ignoreButton" onClick={this.props.action}>
					<Trans>passer</Trans>
				</a>
				<span className="keyIcon" style={{ opacity: this.props.hover ? 1 : 0 }}>
					<Trans>Échap</Trans>
				</span>
			</div>
		)
	}
}
