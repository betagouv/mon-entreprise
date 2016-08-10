import React, { Component } from 'react'

export default class Layout extends Component {
	render() {
		return (<div>
			En-tête
			{this.props.children}
			</div>)
	}
}
