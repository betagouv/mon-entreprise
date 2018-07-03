import React, { Component } from 'react'
import { connect } from 'react-redux'
import { animated, Spring } from 'react-spring'
import {
	blockingInputControlsSelector,
	noUserInputSelector
} from 'Selectors/analyseSelectors'
import Conversation from './conversation/Conversation'
import * as Animate from './inFranceApp/animate'
import Distribution from './ResultView/Distribution'
import './Simu.css'
import TargetSelection from './TargetSelection'
import withColours from './withColours'

@withColours
@connect(
	state => ({
		noUserInput: noUserInputSelector(state),
		blockingInputControls: blockingInputControlsSelector(state),
		conversationStarted: state.conversationStarted
	}),
	{
		onSimulationContinued: () => ({ type: 'START_CONVERSATION' })
	}
)
export default class Simu extends Component {
	render() {
		let {
			colours,
			conversationStarted,
			noUserInput,
			onSimulationContinued,
			blockingInputControls
		} = this.props
		const displayConversation = conversationStarted && !blockingInputControls
		const displayResults =
			!noUserInput && !blockingInputControls && !conversationStarted
		return (
			<>
				<div id="simu">
					<Spring
						to={{
							height: displayResults ? 'auto' : 0,
							opacity: displayResults ? 1 : 0
						}}
						delay={2000}
						native>
						{styles => (
							<animated.div
								style={{
									...styles,
									display: 'flex',
									overflow: 'hidden',
									flexWrap: 'wrap',
									fontSize: '110%',
									justifyContent: 'space-between'
								}}>
								<button
									className="ui__ link-button"
									onClick={onSimulationContinued}>
									Permanent/Fixed term contract
								</button>
								<button
									className="ui__ link-button"
									onClick={onSimulationContinued}>
									Part-time
								</button>
								<button
									className="ui__ link-button"
									onClick={onSimulationContinued}>
									Cadre status
								</button>
								<button
									className="ui__ link-button"
									onClick={onSimulationContinued}>
									Other
								</button>
							</animated.div>
						)}
					</Spring>
					<div id="focusZone">
						{displayConversation && (
							<>
								<Conversation textColourOnWhite={colours.textColourOnWhite} />
							</>
						)}
						<TargetSelection colours={colours} />
					</div>
				</div>

				{displayResults && (
					<Animate.fromBottom>
						<h2>What&apos;s included in my contributions?</h2>
						<Distribution />
						<h2>Estimate my real costs</h2>
						<p>
							This is a <strong>rough estimate</strong> based on a pre-made
							generic contract. French legislation provides for a multitude of
							special cases, and specific rules that can considerably change
							hiring costs.
						</p>
						<p style={{ textAlign: 'center' }}>
							<button className="ui__ button" onClick={onSimulationContinued}>
								Estimate my real costs
							</button>
						</p>
					</Animate.fromBottom>
				)}
			</>
		)
	}
}
