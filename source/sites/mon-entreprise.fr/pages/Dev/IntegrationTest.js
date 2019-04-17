import React, { Component } from 'react'
import { withRouter } from 'react-router'

export default withRouter(
	class IntegrationTest extends Component {
		componentDidMount() {
			const script = document.createElement('script')
			script.id = 'script-simulateur-embauche'
			script['data-couleur'] = script.src =
				window.location.origin + '/dist/simulateur.js'
			script.dataset.couleur = '#2975D1'
			script.dataset.iframeUrl =
				window.location.origin +
				this.props.history.createHref({}) +
				'iframes/simulateur-embauche'
			this.DOMNode.appendChild(script)
		}
		render() {
			return (
				<div style={{ border: '2px solid blue' }}>
					<div ref={ref => (this.DOMNode = ref)} />
				</div>
			)
		}
	}
)
