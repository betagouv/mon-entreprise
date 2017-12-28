import React, { Component } from 'react'
import './Pages.css'
import './Home.css'
import TargetSelection from '../TargetSelection'

export default class Home extends Component {
	state = {
		updateMessage: false
	}
	componentDidMount() {
		setTimeout(() => this.setState({ showUpdateMessage: true }), 1000)
	}
	render() {
		let opacityStyle = { opacity: this.state.showUpdateMessage ? 1 : 0 }
		return (
			<div id="home" className="page">
				<div id="updateMessage">
					<i
						className="fa fa-newspaper-o"
						aria-hidden="true"
						style={opacityStyle}
					/>
					<p style={opacityStyle}>
						Cette nouvelle version du site vous permet de simuler un CDD ou un
						CDI, aux taux de 2018. Joyeuses fêtes !
					</p>
				</div>
				<div id="content">
					<TargetSelection />
				</div>
			</div>
		)
	}
}
