import React, { Component } from 'react'
import Conversation from './conversation/Conversation'
import FoldedSteps, { GoToAnswers } from './conversation/FoldedSteps'
import Explanation from './Explanation'
import GoToExplanations from './GoToExplanations'
import ProgressTip from './ProgressTip'
import './Simu.css'
import Sondage from './Sondage'
import TargetSelection from './TargetSelection'
import withColours from './withColours'
@withColours
export default class Simu extends Component {
	render() {
		let { colours } = this.props

		return (
			<div id="simu">
				<FoldedSteps />
				<div id="focusZone">
					<GoToAnswers />
					<TargetSelection colours={colours} />
					<ProgressTip />
					<Conversation textColourOnWhite={colours.textColourOnWhite} />
					<GoToExplanations />
				</div>
				<Explanation />
				<Sondage />
			</div>
		)
	}
}
