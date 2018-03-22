import React, { Component } from 'react'
import styles from './Simu.css'
import TargetSelection from './TargetSelection'
import withColours from './withColours'
import Conversation from './conversation/Conversation'
import ProgressTip from './ProgressTip'
import FoldedSteps, { GoToAnswers } from './conversation/FoldedSteps'
import Explanation from './Explanation'

@withColours
export default class extends Component {
	render() {
		let { colours } = this.props

		return (
			<div>
				<FoldedSteps />
				<div id="focusZone">
					<GoToAnswers />
					<TargetSelection colours={colours} />
					<ProgressTip />
					<Conversation textColourOnWhite={colours.textColourOnWhite} />
					<Explanation />
				</div>
			</div>
		)
	}
}
