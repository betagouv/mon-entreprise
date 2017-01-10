import React, { Component } from 'react'

export default class IgnoreStepButton extends Component {
	componentDidMount() {
		// removeEventListener will need the exact same function instance
		this.boundHandleKeyDown = this.handleKeyDown.bind(this)
		
		window.addEventListener('keydown', this.boundHandleKeyDown)
	}
	handleKeyDown({key}) {
		if (key !== 'Escape') return
		this.props.action()
	}
	componentWillUnmount() {
		window.removeEventListener('keydown', this.boundHandleKeyDown)
	}
	render() {
		return <a className="ignore" onClick={this.props.action}>
			passer
		</a>
	}
}
