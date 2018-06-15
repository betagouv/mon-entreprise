import React, { Component } from 'react'
import { connect } from 'react-redux'
import './Simu.css'
import TargetSelection from './TargetSelection'
import withColours from './withColours'
import Conversation from './conversation/Conversation'
import Explanation from 'Components/Explanation'
import ProgressTip from './ProgressTip'
import FoldedSteps, { GoToAnswers } from './conversation/FoldedSteps'
//import Explanation from './Explanation'
import GoToExplanations from './GoToExplanations'
import Sondage from './Sondage'
import { noUserInputSelector } from 'Selectors/analyseSelectors'

@withColours
@connect(state => ({
	noUserInput: noUserInputSelector(state),
	conversationStarted: state.conversationStarted
}))
export default class Simu extends Component {
	render() {
		let { colours, conversationStarted, noUserInput } = this.props

		return (
			<div id="simu">
				<div id="focusZone">
					<FoldedSteps />
					<GoToAnswers />
					<TargetSelection colours={colours} />
					{conversationStarted && (
						<>
							<ProgressTip />
							<Conversation textColourOnWhite={colours.textColourOnWhite} />
						</>
					)}
					{!noUserInput && <GoToExplanations />}
				</div>
				{!noUserInput && <Explanation />}
				<Sondage />
			</div>
		)
	}
}
