import React, { Component } from 'react'
import { connect } from 'react-redux'
import './Simu.css'
import TargetSelection from './TargetSelection'
import withColours from './withColours'
import Conversation from './conversation/Conversation'
import ProgressTip from './ProgressTip'
import FoldedSteps, { GoToAnswers } from './conversation/FoldedSteps'
//import Explanation from './Explanation'
import GoToExplanations from './GoToExplanations'
import Sondage from './Sondage'

@withColours
@connect(state => ({
	conversationStarted: state.conversationStarted
}))
export default class extends Component {
	render() {
		let { colours, conversationStarted } = this.props

		return (
			<div id="simu">
				{/*<FoldedSteps />*/}
				<div id="focusZone">
					{/*<GoToAnswers />*/}
					<TargetSelection colours={colours} />
					{conversationStarted && (
						<>
							<ProgressTip />
							<Conversation textColourOnWhite={colours.textColourOnWhite} />
						</>
					)}
					{/*<GoToExplanations />*/}
				</div>
				{/* <Explanation /> */}
				<Sondage />
			</div>
		)
	}
}
