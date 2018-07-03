import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
	noUserInputSelector,
	blockingInputControlsSelector
} from 'Selectors/analyseSelectors'
import Conversation from './conversation/Conversation'
import FoldedSteps, { GoToAnswers } from './conversation/FoldedSteps'
import GoToExplanations from './GoToExplanations'
import ProgressTip from './ProgressTip'
import ResultView from './ResultView/ResultView'
import './Simu.css'
import Sondage from './Sondage'
import TargetSelection from './TargetSelection'
import withColours from './withColours'

@withColours
@connect(state => ({
	noUserInput: noUserInputSelector(state),
	blockingInputControls: blockingInputControlsSelector(state),
	conversationStarted: state.conversationStarted
}))
export default class Simu extends Component {
	render() {
		let {
			colours,
			conversationStarted,
			noUserInput,
			blockingInputControls
		} = this.props

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
					{!noUserInput && !blockingInputControls && <GoToExplanations />}
				</div>
				{!noUserInput && !blockingInputControls && <ResultView />}
				{!blockingInputControls && <Sondage />}
			</div>
		)
	}
}
