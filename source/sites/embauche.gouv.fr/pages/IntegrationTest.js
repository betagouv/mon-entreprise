import React, { Component } from 'react'
import { withRouter } from 'react-router'

@withRouter
export default class IntegrationTest extends Component {
	componentDidMount() {
		const script = document.createElement('script')
		script.id = 'script-simulateur-embauche'
		script['data-couleur'] = script.src =
			window.location.origin + '/dist/simulateur.js'
		script.dataset.couleur = '#2975D1'
		script.dataset.iframeUrl =
			window.location.origin + this.props.history.createHref({})
		this.DOMNode.appendChild(script)
	}
	render() {
		return <div ref={ref => (this.DOMNode = ref)} />
	}
}
