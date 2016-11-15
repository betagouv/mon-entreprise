import React, { Component } from 'react'
import './Layout.css'

export default class Layout extends Component {
	render() {
		return (<div>
			<div id="header"></div>
			{this.props.children}
			<div id="warning">
				Attention ! Tout le contenu de ce site est hautement expérimental.
			</div>
			</div>
		)
	}
}
