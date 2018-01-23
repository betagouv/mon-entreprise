import React, { Component } from 'react'
import './Pages.css'
import './Home.css'
import TargetSelection from '../TargetSelection'
import { connect } from 'react-redux'

@connect(state => ({
	themeColours: state.themeColours
}))
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
						style={{
							...opacityStyle,
							color: this.props.themeColours.textColourOnWhite
						}}
					/>
					<p style={opacityStyle}>
						Cette nouvelle version du site vous permet de simuler un CDD ou CDI,
						aux taux de 2018.
					</p>
				</div>
				<div id="content">
					<TargetSelection themeColours={this.props.themeColours} />
				</div>
			</div>
		)
	}
}
