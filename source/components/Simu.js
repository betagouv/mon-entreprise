import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
	noUserInputSelector,
	blockingInputControlsSelector
} from 'Selectors/analyseSelectors'
import ContinueButton from './Continue'
import Conversation from './conversation/Conversation'
import FoldedSteps, { GoToAnswers } from './conversation/FoldedSteps'
import GoToExplanations from './GoToExplanations'
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
					{conversationStarted &&
						!blockingInputControls && (
							<>
								<Conversation textColourOnWhite={colours.textColourOnWhite} />
							</>
						)}
					<TargetSelection colours={colours} />
					<ContinueButton />
					{conversationStarted &&
						!blockingInputControls && <GoToExplanations />}
				</div>
				{!noUserInput && !blockingInputControls && <ResultView />}
				{!noUserInput && !blockingInputControls && <ContinueButton />}
				{!blockingInputControls && <Sondage />}
			</div>
		)
	}
}
