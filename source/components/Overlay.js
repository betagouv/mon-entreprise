import React, { Component } from 'react'
import './Overlay.css'

export default class Overlay extends Component {
	render() {
		return (
			<div id="overlayWrapper" onClick={this.props.onOuterClick}>
				<div
					id="overlayContent"
					onClick={e => {
						e.preventDefault()
						e.stopPropagation()
					}}>
					{this.props.children}
				</div>
			</div>
		)
	}
}
