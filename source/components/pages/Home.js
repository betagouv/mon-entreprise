import React, { Component } from 'react'
import { Trans, translate } from 'react-i18next'
import './Pages.css'
import './Home.css'
import TargetSelection from '../TargetSelection'
import withColours from '../withColours'

@translate()
@withColours
export default class Home extends Component {
	state = {}
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
							color: this.props.colours.textColourOnWhite
						}}
					/>
					<p style={opacityStyle}>
						<Trans i18nKey="news">
							Le simulateur est maintenant utilisable en anglais
						</Trans>
					</p>
				</div>
				<div id="content">
					<TargetSelection colours={this.props.colours} />
				</div>
			</div>
		)
	}
}
