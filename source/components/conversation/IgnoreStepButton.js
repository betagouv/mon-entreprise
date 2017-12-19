import React, { Component } from 'react'
import './IgnoreStepButton.css'
import HoverDecorator from 'Components/HoverDecorator'

@HoverDecorator
export default class IgnoreStepButton extends Component {
	componentDidMount() {
		// removeEventListener will need the exact same function instance
		this.boundHandleKeyDown = this.handleKeyDown.bind(this)

		window.addEventListener('keydown', this.boundHandleKeyDown)
	}
	handleKeyDown({ key }) {
		if (key !== 'Escape') return
		this.props.action()
	}
	componentWillUnmount() {
		window.removeEventListener('keydown', this.boundHandleKeyDown)
	}
	render() {
		return (
			<div id="ignore">
				<a id="ignoreButton" onClick={this.props.action}>
					passer
				</a>
				<span className="keyIcon" style={{opacity: this.props.hover ? 1 : 0}}>Échap</span>
			</div>
		)
	}
}
