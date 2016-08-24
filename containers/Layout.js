import React, { Component } from 'react'

export default class Layout extends Component {
	render() {
		return (<div>
			<div id="header">En-tête</div>
			{this.props.children}
			</div>)
	}
}
