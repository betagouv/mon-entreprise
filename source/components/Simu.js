import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { animated, Spring } from 'react-spring'
import {
	blockingInputControlsSelector,
	nextStepsSelector,
	noUserInputSelector
} from 'Selectors/analyseSelectors'
import Conversation from './conversation/Conversation'
import * as Animate from './inFranceApp/animate'
import Distribution from './ResultView/Distribution'
import PaySlip from './ResultView/PaySlip'
import './Simu.css'
import TargetSelection from './TargetSelection'
import withColours from './withColours'

@withColours
@connect(
	state => ({
		noUserInput: noUserInputSelector(state),
		blockingInputControls: blockingInputControlsSelector(state),
		conversationStarted: state.conversationStarted,
		nextSteps: state.conversationStarted && nextStepsSelector(state)
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
			nextSteps,
			onSimulationContinued,
			blockingInputControls
		} = this.props
		const firstValidInputEntered =
			!conversationStarted && !blockingInputControls && !noUserInput
		const displayConversation = conversationStarted && !blockingInputControls
		const simulationCompleted =
			!blockingInputControls && conversationStarted && !nextSteps.length

		return (
			<>
				<div id="simu">
					<Spring
						to={{
							height: firstValidInputEntered ? 'auto' : 0,
							opacity: firstValidInputEntered ? 1 : 0
						}}
						native>
						{styles => (
							<animated.div
							className="ui__ button-container"
								style={{
									...styles,
									display: 'flex',
									overflow: 'hidden',
									flexWrap: 'wrap',
									fontSize: '110%',
									justifyContent: 'space-evenly'
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
						{conversationStarted &&
							!nextSteps.length && (
								<>
									<h1> No more questions left!</h1>
									<p>
										This is the most precise estimate that you can get. However,
										some special reglementations rules can impact this result. You can
										read more about it{' '}
										<button className="ui__ link-button">here.</button>
									</p>
									<p> Want to make your hiring project a reality? </p>
									<div style={{ textAlign: 'center' }}>
										<Link className="ui__ button" to="/hiring-process">
											Go to the hiring process
										</Link>
									</div>
								</>
							)}
					<div id="focusZone">
						{displayConversation && (
							<>
								<Conversation textColourOnWhite={colours.textColourOnWhite} />
							</>
						)}
						<TargetSelection colours={colours} />
					</div>
					{conversationStarted &&
						!simulationCompleted && (
							<div style={{ textAlign: 'center' }}>
								<Link className="ui__ button" to="/hiring-process">
									Go to the hiring process
								</Link>
							</div>
						)}
						{simulationCompleted && (
							<Animate.fromBottom>
								<h2>Detailed payslip</h2>
								<PaySlip />
							</Animate.fromBottom>
						)}
				</div>

				{firstValidInputEntered && (
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
